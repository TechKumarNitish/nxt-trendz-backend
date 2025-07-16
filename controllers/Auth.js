const User = require('../models/User')
const { OAuth2Client } = require('google-auth-library');


const client = new OAuth2Client('YOUR_GOOGLE_CLIENT_ID');

//signup...........................................................
exports.signUp = async (req, res) => {
    try {
        //data fetch from request's body
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp
        } = req.body;

        //do the validation 
        if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
            return res.status(403).json({
                success: false,
                message: "All feilds are required"
            });
        }

        // match confirm password and password
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and Confrim Password does not , Please try again!"
            })
        }

        //check user already exits or not
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(401).json({
                success: false,
                message: "User is already registered!",
            });
        }

        //find most recent OTP for the user
        const recentOtp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
        console.log(recentOtp);

        //validate otp
        if (recentOtp.length == 0) {
            //OTP not found
            console.log("rs");
            // return res.status(100).json({
            //     success:false,
            //     message:"OTP not found"
            // })

            return res.status(400).json({
                success: false,
                message: "the OTP is not valid"
            })
        } else if (otp !== recentOtp[0].otp) {
            console.log("rs2");
            return res.status(100).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        //hash the password
        const hashPassword = await bcrypt.hash(password, 10);

        //create entry in db
        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null
        });
        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password: hashPassword,
            accountType,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
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
            message: "User can not be registered please try again!"
        });
    }
}

//login............................................................
exports.login = async (req, res) => {
    try {
        //get data from req body
        const { email, password } = req.body;

        //validation of data
        if (!email || !password) {
            return res.status(403).json({
                success: false,
                message: "All fields are required, please try again!"
            });
        }

        //check for user existence
        const user = await User.findOne({ email }).populate("additionalDetails");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User is not registered, please signup first"
            });
        }

        //match password then generate JWT token
        if (await bcrypt.compare(password, user.password)) {
            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType
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
                token,
                user,
                message: "Logged in successfully"
            });
        }
        else {
            return res.status(401).json({
                success: false,
                message: "password is incorrect!"
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Login failure please try again!"
        });
    }
}

//siging with google...........................................................
exports.googleSigin = async (req, res) => {
    const { token } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: 'YOUR_GOOGLE_CLIENT_ID',
        });

        const payload = ticket.getPayload();
        const { sub, email, name, picture } = payload;

        // 🔁 Upsert user to DB here
        // Check or create user
        let user = await User.findOne({ googleId: sub });
        if (!user) {
            user = await User.create({ googleId: sub, username:email, name, picture });
        }

        const payloadData = {
            email,
            id: user._id,
            accountType: user.accountType
        };
        const token = jwt.sign(payloadData, process.env.JWT_SECRETE, {
            expiresIn: "2h",
        });
        user.token = token;

        //create cookie and send response
        const options = {
            expires: new Date(Date.now() + 3 * 27 * 60 * 60 * 1000),
            httpOnly: true,
        }
        res.cookie("token", token, options).status(200).json({
            success: true,
            token,
            user,
            message: "Logged in successfully"
        });

        res.status(200).json({ id: sub, email, name, picture });
    } catch (err) {
        console.error('Google Auth Error:', err);
        res.status(401).json({ message: 'Invalid token' });
    }
};


