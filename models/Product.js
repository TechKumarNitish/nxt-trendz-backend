const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  brand: { type: String },
  price: { type: Number, required: true },
  image_url: { type: String, required: true },
  rating: { type: Number },
  style: { type: String },
  description: { type: String },
  total_reviews: { type: Number },
  availability: { type: String },
  isPrime: { type: Boolean, required: true, default: false }  // <– flag to separate
});

module.exports = mongoose.model('Product', productSchema);
