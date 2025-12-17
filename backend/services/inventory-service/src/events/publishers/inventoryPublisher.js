const { getChannel } = require("../../utils/rabbitmq");

const publishInventoryReserved = async (payload) => {
  const channel = getChannel();

  await channel.assertQueue("inventory_reserved", { durable: true });

  channel.sendToQueue(
    "inventory_reserved",
    Buffer.from(JSON.stringify(payload)),
    { persistent: true }
  );
};

const publishInventoryFailed = async (payload) => {
  const channel = getChannel();

  await channel.assertQueue("inventory_failed", { durable: true });

  channel.sendToQueue(
    "inventory_failed",
    Buffer.from(JSON.stringify(payload)),
    { persistent: true }
  );
};

module.exports = {
  publishInventoryReserved,
  publishInventoryFailed,
};
