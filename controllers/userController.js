const {Sign, Verify} = require('./../jwt');
const bcrypt = require('bcrypt');

const UserSchema = require("./../models/userSchema");
const UserSessions = require("./../models/userSessionsSchema");

const registerUser = async ({email, password}) => {
    try {
        if (!email || !password) return {success: false, message: "All input is required"}

        const oldUser = await UserSchema.findOne({email});

        if (oldUser) return {success: false, message: "User Already Exist. Please Login"};

        const encryptedPassword = await bcrypt.hash(password, 10);

        const user = await UserSchema.create({
            email: email.toLowerCase(),
            password: encryptedPassword
        });
        // Create token
        const token = Sign(
            {userId: user._id, email: email.toLowerCase()},
            process.env.JWT_SECRET,
            "2h",
        );
        return {
            email: user.email,
            password: user.password,
            token,
            success: true,
            message: "User successfully registered"
        };
    } catch (err) {
        return {success: false, message: "Something went wrong", err}
    }
}

const loginUser = async ({email, password}) => {
    try {
        if (!email || !password) return {success: false, message: "All input is required"};
        const user = await UserSchema.findOne({email});
        if (user && (await bcrypt.compare(password, user.password))) {
            // Create token
            const token = Sign(
                {userId: user._id, email: email.toLowerCase()},
                process.env.JWT_SECRET,
                "2h",
            );
            await UserSessions.create({id: user._id, start: new Date(), token});
            return {
                email: user.email,
                password: user.password,
                _id: user._id,
                token,
                success: true,
                message: "User logged in"
            };
        }
        return {success: false, message: "Invalid Credentials"};
    } catch (err) {
        return {success: false, message: "Something went wrong"};
    }
}

const logoutUser = async ({email, token}) => {
    try {
        if (await Verify(token)) {
            await UserSessions.updateOne({token, email}, {end: new Date});
        } else {
            return {success: false, message: "Token expired"};
        }
    } catch (err) {
        return {success: false, message: "Something went wrong"};
    }
}

const userSessions = async ({email, token}) => {
    try {
        console.log(email, token)
        if (typeof email === 'undefined' || typeof token === 'undefined') return 'User not logged in';
        if (!await Verify(token)) {
            return {success: false, message: "Token expired"};
        }
        return await UserSessions.find({email}, {_id: 0, __v: 0, id: 0, token: 0});

    } catch (err) {
        return {success: false, message: "Something went wrong"};
    }
}

module.exports.registerUser = registerUser;
module.exports.loginUser = loginUser;
module.exports.logoutUser = logoutUser;
module.exports.userSessions = userSessions;
