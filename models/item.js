const mongoose = require('mongoose');
const Schema = mongoose.Schema

const itemSchema = new mongoose.Schema({ 
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref:'Category' },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 0 },
  url: { type: String, default:"coming-soon-gba21e4be9_640.jpg" }
 });

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;