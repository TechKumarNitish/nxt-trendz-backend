// Import the required modules
const express = require("express")
const router = express.Router()
const{getPrimeProducts, getProducts}=require('../controllers/Product')


router.get("/", getProducts);
router.get("/prime-deals", getPrimeProducts)

module.exports=router