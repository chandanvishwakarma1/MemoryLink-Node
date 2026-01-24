//External Module
import { createAvatar } from "@dicebear/core";
import { glass } from "@dicebear/collection";
import jwt from 'jsonwebtoken';
import 'dotenv/config';
//Local Module
import User from "../Models/User.js";
import { generateOtp, hashOtp, verifyOtp } from "../lib/otp.js";
import OtpModel from "../Models/OtpModel.js"
import { sendEmail } from "../lib/email/email.js";
import { otpTemplate } from "../lib/email/templates/otp.js";
import { waitlistTemplate } from "../lib/email/templates/waitlist.js";


const generateToken = (userId) => {
    try {
        return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "15d" });
    } catch (error) {
        console.log('Error generating Token', error);
    }
};

export const postJoinWaitList = async (req, res, next) => {
    try {
        const { email } = req.body;
        //Validation
        if (!email) return res.status(400).json({ message: "Email is required. " });

        // A standard regex for 2025 that covers 99% of use cases
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Please enter a valid email address." });
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            if (existingUser.status === 'waitlist') {
                return res.status(200).json({ success: true, message: "You are already on the waitlist." });
            } else {
                return res.status(400).json({ success: false, message: "Email already registered." });
            }
        }

        //creating new user
        const user = new User({
            email,
            status: 'waitlist',
        })

        //save the user
        await user.save();

        //send otp
        const namePart = email.split('@')[0];
        const formattedName = namePart.replace(/[._-]/g, ' ');
        const subject = "You're on the waitlist"
        const to = email;
        const html = waitlistTemplate({ name: formattedName});
        const response = await sendEmail(subject, to, html);

        //return response
        res.status(201).json({
            success: true,
            message: "You have been added to the waitlist.",
        })
    } catch (error) {
        console.log("Error adding the user", error);
        res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
}
export const postRegister = async (req, res, next) => {


    try {
        const { username, email, fullName, birthdate, gender, password, hasAcceptedTermsAndPrivacy, userOtp } = req.body;

        // Convert string booleans to actual booleans
        const toBoolean = (v) => v === true || v === 'true';
        const hasAcceptedTermsAndPrivacyBool = toBoolean(hasAcceptedTermsAndPrivacy);


        //Form Validation
        if (!username || !email || !fullName || !password || !birthdate || !gender) return res.status(400).json({
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
            return res.status(400).json({ message: "Username can only contain lowercase letters, numbers, underscores, and periods." });
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
        //lowercase username
        const lowerCaseUsername = username.toLowerCase();

        // A standard regex for 2025 that covers 99% of use cases
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Please enter a valid email address." });
        }

        //Birthdate Validation and Processing
        if (!birthdate) return res.status(400).json({ message: "Birthdate is required." });

        const inputDate = new Date(birthdate);

        // Check if the date is valid
        if (isNaN(inputDate.getTime())) {
            return res.status(400).json({ message: "Invalid birthdate format." });
        }

        // Create UTC date at 00:00:00 for storage
        const date = new Date(Date.UTC(
            inputDate.getFullYear(),
            inputDate.getMonth(),
            inputDate.getDate()
        ));

        // Future Date Check
        const today = new Date();
        if (date > today) {
            return res.status(400).json({ message: "Birthdate cannot be in the future." });
        }

        // Age Calculation and validation
        // Standard for COPPA/GDPR-K compliance (minimum age 13)
        const age = today.getFullYear() - date.getFullYear();
        const monthDiff = today.getMonth() - date.getMonth();
        const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate()) ? age - 1 : age;

        if (actualAge < 13) {
            return res.status(400).json({ message: "You must be at least 13 years old to register." });
        }

        //Gender validation
        const validGenders = ['Male', 'Female', 'Other', 'Prefer not to say'];
        if (!validGenders.includes(gender)) {
            return res.status(400).json({ message: "Please select a valid gender option." });
        }

        //hasAcceptedTermsAndPrivacy validation
        if (!hasAcceptedTermsAndPrivacyBool) return res.status(400).json({ message: "User must accept Terms & Privacy" })


        //Check if user exists or not
        // const existingEmail = await User.findOne({ email });
        // if (existingEmail) return res.status(400).json({ message: "Email already exits." });

        //for waitlist remove after luanch
        const existingEmail = await User.findOne({ email });
        if (!existingEmail) return res.status(400).json({ message: "Please join the waitlist first." });

        if (existingEmail.status === 'waitlist') return res.status(400).json({ message: "Still on waitlist. Please wait for approval. " });

        if (existingEmail.status === 'active') return res.status(400).json({ message: "Email already exists. " });




        const existingUsername = await User.findOne({ lowerCaseUsername });
        if (existingUsername) return res.status(400).json({ message: "Username already exists." });

        //Verify otp
        await verifyOtp(userOtp, email);
        const isVerified = true;

        //provide random profileImage
        const profileImage = `https://api.dicebear.com/9.x/glass/svg?seed=${lowerCaseUsername}&&radius=50&&scale=50`


        //creating new user
        // const user = new User({
        //     fullName,
        //     username: lowerCaseUsername,
        //     email,
        //     status: 'active',
        //     birthdate: date,
        //     gender,
        //     password,
        //     profileImage,
        //     hasOnBoarded: true,
        //     hasAcceptedTermsAndPrivacy: hasAcceptedTermsAndPrivacyBool,
        //     termsAcceptedAt: new Date(),
        //     isVerified,
        //     verifiedAt: isVerified ? new Date() : null,
        // })

        //for waitlist changelater
        const user = await User.findByIdAndUpdate(existingEmail._id, {
            fullName,
            username: lowerCaseUsername,
            email,
            status: 'active',
            birthdate: date,
            gender,
            password,
            profileImage,
            hasOnBoarded: true,
            hasAcceptedTermsAndPrivacy: hasAcceptedTermsAndPrivacyBool,
            termsAcceptedAt: new Date(),
            isVerified,
            verifiedAt: isVerified ? new Date() : null,
        }, { new: true })

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
                birthdate: user.birthdate,
                gender: user.gender,
                profileImage: user.profileImage,
                createdAt: user.createdAt,
            }
        })
    } catch (error) {
        console.log("Error registering the user", error);
        res.status(500).json({ message: error.message || "Internal server error" });
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
                birthdate: existingUser.birthdate,
                gender: existingUser.gender,
                profileImage: existingUser.profileImage,
                createdAt: existingUser.createdAt,
            }
        })
    } catch (error) {
        console.log("Error logging in: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const postRequestOtp = async (req, res, next) => {
    try {
        const { email, purpose } = req.body;

        //Validation
        if (!email) return res.status(400).json({ message: "Email is required.", success: false, });

        if (!purpose) return res.status(400).json({ message: "OTP purpose is required", success: false });

        //Generate OTP
        const serverOtp = generateOtp();
        if (!serverOtp) throw new Error('Failed to generate OTP');

        //hash Otp
        const otpHash = hashOtp(serverOtp);

        //Set Expiry
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        //delete old for same purpose
        await OtpModel.deleteMany({
            ...(email && { email }),
            purpose,
        });

        //save otp
        const otp = new OtpModel({
            email,
            otpHash,
            expiresAt,
            purpose,
        })
        await otp.save();

        //send otp
        const subject = "Your Verification Code"
        const to = email;
        const html = otpTemplate({ otp: serverOtp, expiresIn: 10 });
        const response = await sendEmail(subject, to, html);

        return res.status(200).json({
            message: "Otp sent successfully",
            success: true,
        })
    } catch (error) {
        console.log('Error while requesting otp:', error);
        res.status(500).json({
            message: error.message || "Something went wrong", success: false
        });
    }
}

export const postRequestResendOtp = async (req, res, next) => {
    try {
        const { email, purpose } = req.body;

        // 1. Basic Validation
        if (!email) return res.status(400).json({ message: "Email is required.", success: false });
        if (!purpose) return res.status(400).json({ message: "OTP purpose is required", success: false });

        // 2. Fetch the most recent OTP record
        const lastOtp = await OtpModel.findOne({ email, purpose });

        if (lastOtp) {
            // 3. BACKEND COOLDOWN VALIDATION (60 seconds)
            // Using updated_at ensures we track the literal last time an email was triggered
            const secondsSinceLastSend = (Date.now() - new Date(lastOtp.updatedAt).getTime()) / 1000;
            if (secondsSinceLastSend < 60) {
                return res.status(429).json({
                    message: `Please wait ${Math.ceil(60 - secondsSinceLastSend)}s before resending.`,
                    success: false
                });
            }

            //MAXIMUM ATTEMPTS VALIDATION (Limit to 3 resends)
            if (lastOtp.resendCount >= 3) {
                return res.status(403).json({
                    message: "Maximum resend attempts reached. Please try again later.",
                    success: false
                });
            }
        }

        // 5. Prepare New OTP Data
        const serverOtp = generateOtp();
        if (!serverOtp) throw new Error('Failed to generate OTP');

        const otpHash = hashOtp(serverOtp);
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 Minutes

        // 6. ATOMIC UPDATE (Upsert)
        await OtpModel.findOneAndUpdate(
            { email, purpose },
            {
                otpHash,
                expiresAt,
                attempts: 0,
                $inc: { resendCount: 1 } // Increment the resend counter
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        // 7. Send Email
        const subject = "Your Verification Code (Resent)";
        const html = otpTemplate({ otp: serverOtp, expiresIn: 10 });
        await sendEmail(subject, email, html);

        return res.status(200).json({
            message: "New OTP sent successfully",
            success: true,
        });

    } catch (error) {
        console.error('Error while requesting resend otp:', error);
        res.status(500).json({
            message: error.message || "Something went wrong",
            success: false
        });
    }
};
