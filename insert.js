const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config()
const { prime, data } = require('./utils/getData'); // typo: 'rquire' → 'require'

async function insertAllProducts() {
  const allProducts = [
    ...prime.prime_deals.map(p => ({ ...p, isPrime: true })),
    ...data.products.map(p => ({
      ...p,
      isPrime: false,
      style: null,
      description: null,
      total_reviews: null,
      availability: null,
      rating: parseFloat(p.rating),
    })),
  ];

  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await Product.deleteMany(); // optional: wipe existing
    await Product.insertMany(allProducts);

    console.log('✅ All products inserted');
  } catch (err) {
    console.error('❌ Error inserting products:', err);
  } finally {
    await mongoose.disconnect();
  }
}

insertAllProducts();
