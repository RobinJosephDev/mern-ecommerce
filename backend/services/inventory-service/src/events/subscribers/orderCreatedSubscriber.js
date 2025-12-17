const Inventory = require("../../models/Inventory");
const {
  publishInventoryReserved,
  publishInventoryFailed,
} = require("../publishers/inventoryPublisher");
const { getChannel } = require("../../utils/rabbitmq");

const subscribeOrderCreated = async () => {
  const channel = getChannel();

  await channel.assertQueue("order_created", { durable: true });

  channel.consume("order_created", async (msg) => {
    const event = JSON.parse(msg.content.toString());
    const { orderId, items } = event;

    console.log(`Inventory processing order ${orderId}`);

    try {
      // 1️⃣ Check stock
      for (const item of items) {
        const stock = await Inventory.findOne({
          productId: item.productId,
        });

        if (!stock || stock.stock < item.quantity) {
          await publishInventoryFailed({
            orderId,
            reason: "INSUFFICIENT_STOCK",
          });

          channel.ack(msg);
          return;
        }
      }

      // 2️⃣ Reserve stock
      for (const item of items) {
        await Inventory.updateOne(
          { productId: item.productId },
          { $inc: { stock: -item.quantity } }
        );
      }

      // 3️⃣ Emit success
      await publishInventoryReserved({
        orderId,
        status: "INVENTORY_RESERVED",
      });

      console.log(`Inventory reserved for ${orderId}`);
      channel.ack(msg);
    } catch (err) {
      console.error("Inventory error:", err);
      channel.nack(msg, false, true); // retry
    }
  });
};

module.exports = subscribeOrderCreated;
