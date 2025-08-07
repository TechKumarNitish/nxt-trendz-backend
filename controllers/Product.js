const Product = require('../models/Product');

exports.getProducts = async (req, res) => {
  try {
    const { sort_by, category, title_search, rating } = req.query;

    const filter = {};

    if (category) filter.category_id= category; // 🔁 update to match your DB
    if (title_search) filter.title = { $regex: title_search, $options: 'i' };
    if (rating) filter.rating = { $gte: parseFloat(rating) };

    const sortOptions = {};
    if (sort_by === 'PRICE_HIGH') sortOptions.price = 1;
    else if (sort_by === 'PRICE_LOW') sortOptions.price = -1;

    const products = await Product.find(filter).sort(sortOptions);
    // console.log(products)
    res.json({ total: products.length, products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.getPrimeProducts= async (req, res) => {
  try {

    
    const prime_deals = await Product.find({isPrime:true})
    res.json({ total: prime_deals.length, prime_deals });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.getProductDetails=async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) return res.status(404).json({ error_msg: 'Product not found' });

    const similarProducts = await Product.find({
      _id: { $in: product.similar_products }
    }).lean();

    const formatProduct = (p) => ({
      id: p._id,
      image_url: p.image_url,
      title: p.title,
      style: p.style || 'Not specified',
      price: p.price,
      description: p.description || 'No description available.',
      brand: p.brand || 'Unknown',
      total_reviews: p.total_reviews || 0,
      rating: p.rating || 0,
      availability: p.availability || 'Out of Stock'
    });

    const response = formatProduct(product);
    response.similar_products = similarProducts.map(formatProduct);

    res.json(response);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};