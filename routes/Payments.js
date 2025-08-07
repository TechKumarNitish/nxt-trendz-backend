const express = require('express')
const router = express.Router()
const crypto = require('crypto')
const { razorpay } = require('../config/razorpay')
const Order = require('../models/Order')
const User = require('../models/User') // auth middleware gives you req.user
const Product = require('../models/Product')
const mailSender = require("../utils/mailSender")
const { productPurchasedByUser } = require("../mail/template")
const { auth, isCustomer, isSuperAdmin } = require("../middleware/auth")

router.post('/create-order', async (req, res) => {
    try {
        const { amount, currency = 'INR' } = req.body;

        const options = {
            amount: amount * 100, // Razorpay uses paise
            currency,
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options); // ✅ FIXED
        res.json({ orderId: order.id, amount: order.amount, currency });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Order creation failed' });
    }
});



router.post('/verify-payment', auth, async (req, res) => {
    try {
        const user = req.user
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, items } = req.body
        // items = [{ productId, quantity }]

        // Signature verification
        const generatedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex')

        if (generatedSignature !== razorpay_signature) {
            return res.status(400).json({ success: false, message: 'Invalid signature' })
        }

        // Build order items & calculate total
        const orderDocs = []
        let total = 0

        for (const item of req.body.items) {
            const product = await Product.findById(item.id);
            if (!product) continue;

            const itemTotal = product.price 
            total+=itemTotal

            orderDocs.push({
                user: req.user.id,
                product: product._id,
                quantity: item.quantity,
                totalPrice: itemTotal,
                paymentStatus: 'completed',
            });
        }

        if (orderDocs.length > 0) {
            await Order.insertMany(orderDocs);
        }

        // Send mail to super admin
        const userName = req.user.name || 'User'
        const summaryLine = orderDocs
            .map(item => `• ${item.quantity} x ${item.product}`)
            .join('<br>')

        const subject = `🛍️ New Purchase Alert – ${userName} placed an order`
        const html = productPurchasedByUser(userName, 'multiple products', total, 'see items below:<br>' + summaryLine)

        await mailSender("rskban15a2015@gmail.com", subject, html)

        res.json({ success: true})
    } catch (err) {
        console.error(err)
        res.status(500).json({ success: false, message: 'Server error' })
    }
})


module.exports = router
