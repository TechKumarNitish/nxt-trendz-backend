const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: { type: String, unique: true, sparse: true },
  username: { type: String, unique: true, sparse: true },
  password: { type: String },
  name: String,
  picture: String,
  role: {
    type: String,
    enum: ['customer', 'super-admin'],
    default: 'customer',
  },
  purchasedProducts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    }
  ],
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
