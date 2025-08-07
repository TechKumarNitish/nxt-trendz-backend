const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // using custom string _id
  title: { type: String, required: true },
  brand: { type: String },
  price: { type: Number, required: true },
  image_url: { type: String, required: true },
  rating: { type: Number },
  style: { type: String },
  description: { type: String },
  total_reviews: { type: Number },
  availability: { type: String },
  category_id: { type: Number },
  isPrime: { type: Boolean, required: true, default: false },
  similar_products: [{ type: String, ref: 'Product' }] // referencing other products by ID
});

module.exports = mongoose.model('Product', productSchema);
