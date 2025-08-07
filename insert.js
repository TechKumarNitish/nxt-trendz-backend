// const mongoose = require('mongoose');
// const Product = require('./models/Product');
// require('dotenv').config()
// const { prime, data } = require('./utils/getData'); // typo: 'rquire' → 'require'

// const getCategoryId = (url) => {
//   if (url.includes('clothes')) return '1';
//   if (url.includes('electronics')) return '2';
//   if (url.includes('appliances')) return '3';
//   if (url.includes('grocery')) return '4';
//   if (url.includes('toys')) return '5';
//   return null;
// };



// async function insertAllProducts() {
//   const allProducts = [
//     ...prime.prime_deals.map(p => ({ ...p, isPrime: true })),
//     ...data.products.map(p => ({
//       ...p,
//       isPrime: false,
//       style: null,
//       description: null,
//       total_reviews: null,
//       availability: null,
//       rating: parseFloat(p.rating),
//     })),
//   ];

//   const updatedProducts = allProducts.map(p => ({
//     ...p,
//     category_id: getCategoryId(p.image_url)
//   }));
//   console.log(updatedProducts)

//   try {
//     await mongoose.connect(process.env.MONGODB_URL, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     // await Product.deleteMany(); // optional: wipe existing
//     // await Product.insertMany(updatedProducts);
//     const p=await Product.find();
//     console.log(p)

//     console.log('✅ All products inserted');
//   } catch (err) {
//     console.error('❌ Error inserting products:', err);
//   } finally {
//     await mongoose.disconnect();
//   }
// }

// insertAllProducts();
