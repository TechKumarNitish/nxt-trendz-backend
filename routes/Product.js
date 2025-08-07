// Import the required modules
const express = require("express")
const router = express.Router()
const{getPrimeProducts, getProducts, getProductDetails}=require('../controllers/Product')


router.get("/", getProducts);
router.get("/prime-deals", getPrimeProducts)
router.get("/:id", getProductDetails)
module.exports=router