const amqp = require("amqplib");

let channel;

const connectRabbitMQ = async () => {
  const connection = await amqp.connect(process.env.RABBITMQ_URL);
  channel = await connection.createChannel();

  await channel.assertQueue("order_created", { durable: true });
  await channel.assertQueue("inventory_reserved", { durable: true });
  await channel.assertQueue("inventory_failed", { durable: true });

  console.log("Inventory Service RabbitMQ connected");
};

const consumeOrderCreated = async (handler) => {
  if (!channel) throw new Error("RabbitMQ channel not ready");

  channel.consume("order_created", async (msg) => {
    if (!msg) return;

    const payload = JSON.parse(msg.content.toString());

    try {
      await handler(payload);
      channel.ack(msg);
    } catch (err) {
      console.error("Inventory processing failed:", err);
      channel.nack(msg, false, false); // dead-letter or drop
    }
  });
};

const publishToQueue = async (queue, payload) => {
  if (!channel) throw new Error("RabbitMQ channel not ready");

  channel.sendToQueue(queue, Buffer.from(JSON.stringify(payload)), {
    persistent: true,
  });
};

module.exports = {
  connectRabbitMQ,
  consumeOrderCreated,
  publishToQueue,
};
