const Product = require('../models/Product');

exports.getProducts= async (req, res) => {
  try {
    const { sort_by, category, title_search, rating } = req.query;

    const filter = {};

    if (category) filter.brand = category;
    if (title_search) filter.title = { $regex: title_search, $options: 'i' };
    if (rating) filter.rating = { $gte: parseFloat(rating) };

    const sortOptions = {};
    if (sort_by === 'PRICE_HIGH') sortOptions.price = 1;
    else sortOptions.price = -1;

    const products = await Product.find(filter).sort(sortOptions);
    res.json({ total: products.length, products });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

exports.getPrimeProducts= async (req, res) => {
  try {


    const products = await Product.find({is_prime:true})
    res.json({ total: products.length, products });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
