// Import the required modules
const express = require("express")
const router = express.Router()

// Import the required controllers and middleware functions
const {
  login,
  signUp,
  googleLogin
} = require("../controllers/Auth")


// Routes for Login, Signup

// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************

// Route for user login
router.post("/login", login)

// Route for user signup
router.post("/signup", signUp)

router.post("/google", googleLogin)

module.exports = router