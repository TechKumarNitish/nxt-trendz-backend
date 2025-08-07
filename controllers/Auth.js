const User = require('../models/User')
const { OAuth2Client } = require('google-auth-library');
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

require("dotenv").config()

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

//signup...........................................................
exports.signUp = async (req, res) => {
    try {
        //data fetch from request's body
        const {
            username,
            password,
            accountType = "customer",

        } = req.body;

        //do the validation 
        if (!username || !password) {
            return res.status(403).json({
                success: false,
                error_msg: "All feilds are required"
            });
        }

        //check user already exits or not
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(401).json({
                success: false,
                error_msg: "User is already registered!",
            });
        }

        //hash the password
        const hashPassword = await bcrypt.hash(password, 10);

        const user = await User.create({

            username,
            password: hashPassword,
            accountType,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${username}`,
        });

        //return res
        return res.status(200).json({
            success: true,
            message: "User is registered successfully",
            user,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            error_msg: "User can not be registered please try again!"
        });
    }
}

//login............................................................
exports.login = async (req, res) => {
    try {
        //get data from req body
        console.log("req: ", req.body)

        const { username, password } = req.body;

        //validation of data
        if (!username || !password) {
            return res.status(403).json({
                success: false,
                error_msg: "All fields are required, please try again!"
            });
        }

        //check for user existence
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({
                success: false,
                error_msg: "User is not registered, please signup first"
            });
        }

        //match password then generate JWT token
        if (await bcrypt.compare(password, user.password)) {
            const payload = {
                username: user.username,
                id: user._id,
                accountType: user.role
            };
            const token = jwt.sign(payload, process.env.JWT_SECRETE, {
                expiresIn: "2h",
            });
            user.token = token;
            user.password = undefined;

            //create cookie and send response
            const options = {
                expires: new Date(Date.now() + 3 * 27 * 60 * 60 * 1000),
                httpOnly: true,
            }
            res.cookie("token", token, options).status(200).json({
                success: true,
                jwt_token: token,
                user,
                message: "Logged in successfully"
            });
        }
        else {
            return res.status(401).json({
                success: false,
                error_msg: "password is incorrect!"
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            error_msg: "Login failure please try again!"
        });
    }
}

//siging with google...........................................................
exports.googleLogin = async (req, res) => {
    try {
        const { credential } = req.body

        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        })

        const payload = ticket.getPayload()
        const { email, name, picture } = payload

        let user = await User.findOne({ username: email })

        if (!user) {
            user = await User.create({ username: email })
        }

        const payloadData = {
            username: user.username,
            id: user._id,
            accountType: user.role
        };
        const token = jwt.sign(payloadData, process.env.JWT_SECRETE, {
            expiresIn: "2h",
        });
        user.token = token;
        user.password = undefined;

        //create cookie and send response
        const options = {
            expires: new Date(Date.now() + 3 * 27 * 60 * 60 * 1000),
            httpOnly: true,
        }
        res.cookie("token", token, options).status(200).json({
            success: true,
            jwt_token: token,
            user,
            message: "Logged in successfully"
        });
    } catch (e) {
        console.log(e)
        res.status(500).json("server error")
    }
}