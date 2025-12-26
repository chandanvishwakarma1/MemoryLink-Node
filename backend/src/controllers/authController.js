//External Module
import { createAvatar } from "@dicebear/core";
import { glass } from "@dicebear/collection";
import jwt from 'jsonwebtoken';
import 'dotenv/config';
//Local Module
import User from "../Models/User.js";


const generateToken = (userId) => {
    try {
        return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "15d" });
    } catch (error) {
        console.log('ERror generating Token', error);
    }
}

export const postRegister = async (req, res, next) => {
    try {
        const { username, email, birthdate, gender, password, hasOnBoarded } = req.body;

        //Form Validation
        if (!username || !email || !password || !birthdate || !gender) return res.status(400).json({
            message: "All fields are required."
        });

        if (password.length < 10) return res.status(400).json({ message: "Password must be atleast 10 characters." });

        if (!/\d/.test(password)) return res.status(400).json({ message: "Password must contain atleast one number." });

        if (!/[A-Z]/.test(password)) return res.status(400).json({ message: "Password must contain atleast one Uppercase letter." });

        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return res.status(400).json({ message: "Password must contain atleast one Special character." });

        if (username.length < 3) return res.status(400).json({ message: "Username must be at least 3 characters long." });

        if (username.length > 20) return res.status(400).json({ message: "Username must be no more than 20 characters long." });

        // Only allow lowercase letters, numbers, underscores, and periods
        const usernameRegex = /^[a-z0-9_.]+$/;
        if (!usernameRegex.test(username)) {
            return res.status(400).json({ message: "Username can only contain letters, numbers, underscores, and periods." });
        }

        // Check for consecutive special characters
        if (username.includes('__') || username.includes('..') || username.includes('_.') || username.includes('._')) {
            return res.status(400).json({ message: "Username cannot contain consecutive special characters." });
        }

        // Username cannot start or end with special characters
        if (username.startsWith('_') || username.startsWith('.') ||
            username.endsWith('_') || username.endsWith('.')) {
            return res.status(400).json({ message: "Username cannot start or end with special characters." });
        }

        // A standard regex for 2025 that covers 99% of use cases
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Please enter a valid email address." });
        }
        //lowercase username
        const lowerCaseUsername = username.toLowerCase();


        //Check if user exists or not
        const existingEmail = await User.findOne({ email });
        if (existingEmail) return res.status(400).json({ message: "Email already exits." });

        const existingUsername = await User.findOne({ lowerCaseUsername });
        if (existingUsername) return res.status(400).json({ message: "Username already exists." });

        //provide random profileImage
        const profileImage = `https://api.dicebear.com/9.x/glass/svg?seed=${lowerCaseUsername}&&radius=50&&scale=50`

        
        //creating new user
        const user = new User({
            username : lowerCaseUsername,
            email,
            password,
            profileImage,
        })

        //save the user
        await user.save();

        //generate the token
        const token = generateToken(user._id);

        //return response
        res.status(201).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
                createdAt: user.createdAt,
            }
        })
    } catch (error) {
        console.log("Error registering the user", error);
        res.status(500).json({ message: `Internal server error` });
    }
}

export const postLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        //Form Validation
        if (!email || !password) return res.status(400).json({ message: "All fields are required." });
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Please enter a valid email address." });
        }

        //Check if user exists or not
        const existingUser = await User.findOne({ email });
        if (!existingUser) return res.status(400).json({ message: "Invalid credentials" });

        //Check if password is correct or not
        const isPasswordCorrect = await existingUser.comparePassword(password);
        if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

        //Generate token
        const token = generateToken(existingUser._id);

        //Return response
        res.status(200).json({
            token,
            user: {
                id: existingUser._id,
                username: existingUser.username,
                email: existingUser.email,
                profileImage: existingUser.profileImage,
                createdAt: existingUser.createdAt,
            }
        })
    } catch (error) {
        console.log("Error logging in: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
