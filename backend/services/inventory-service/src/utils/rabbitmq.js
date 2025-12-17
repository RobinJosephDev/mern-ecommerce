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

const getChannel = () => {
  if (!channel) throw new Error("RabbitMQ channel not initialized");
  return channel;
};

const publishEvent = async (queue, payload) => {
  if (!channel) throw new Error("RabbitMQ channel not initialized");

  channel.sendToQueue(queue, Buffer.from(JSON.stringify(payload)), {
    persistent: true,
  });
};

module.exports = {
  connectRabbitMQ,
  getChannel,
  publishEvent,
};
