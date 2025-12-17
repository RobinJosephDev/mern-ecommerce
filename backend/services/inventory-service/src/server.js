require("dotenv").config();
const mongoose = require("mongoose");
const Inventory = require("./models/Inventory");
const {
  connectRabbitMQ,
  getChannel,
  publishEvent,
} = require("./utils/rabbitmq");

// ---------- MongoDB ----------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Inventory DB connected"))
  .catch(console.error);

const start = async () => {
  // ---------- RabbitMQ ----------
  await connectRabbitMQ();
  const channel = getChannel();

  await channel.assertQueue("order_created", { durable: true });

  channel.consume("order_created", async (msg) => {
    const event = JSON.parse(msg.content.toString());
    const { orderId, items } = event;

    console.log(`Checking inventory for order ${orderId}`);

    try {
      // Validate stock
      for (const item of items) {
        const inventory = await Inventory.findOne({
          productId: item.productId,
        });

        if (!inventory || inventory.stock < item.quantity) {
          publishEvent("inventory_failed", {
            orderId,
            reason: "INSUFFICIENT_STOCK",
          });

          channel.ack(msg);
          return;
        }
      }

      //  Reserve stock
      for (const item of items) {
        await Inventory.updateOne(
          { productId: item.productId },
          { $inc: { stock: -item.quantity } }
        );
      }

      // Emit success event
      publishEvent("inventory_reserved", {
        orderId,
        status: "INVENTORY_RESERVED",
      });

      console.log(`Inventory reserved for order ${orderId}`);
      channel.ack(msg);
    } catch (err) {
      console.error("Inventory error:", err);
      channel.nack(msg, false, true); // retry
    }
  });
};

start().catch(console.error);
