require("dotenv").config();
const mongoose = require("mongoose");
const Inventory = require("../src/models/Inventory");

(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  await Inventory.create({
    productId: "68da33854fb852daa63e1cf5",
    stock: 50,
  });

  console.log("Inventory seeded");
  process.exit();
})();
