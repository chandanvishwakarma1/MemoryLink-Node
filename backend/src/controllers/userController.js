import User from "../Models/User.js";

export const validateUsername = async (req, res, next) => {
    try {
        const { username } = req.body;
        // console.log("user:", username);
        const isAvailable = await User.exists({ username });
        if (isAvailable) return res.status(400).json({ message: "Username already taken", success: false });

        res.json({
            message: "Username available",
            success: true
        })
    } catch (error) {
        console.log("Error validating username: ", error);
        res.status(401).json({ message: "Token is not valid", success: false })
    }
}

export const changeUsername = async (req, res, next) => {
    try {
        const { username } = req.body;

        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ message: "Username already exists", success: false })

        // const result = await User.updateOne({ _id: req.user._id }, { username });
        // if (result.modifiedCount === 0) {
        //     return res.status(404).json({
        //         message: "User not found or username is the same",
        //         success: false,
        //     });
        // }
        const updatedUserDoc = await User.findByIdAndUpdate(
            req.user._id,
            { username },
            { new: true } // Returns the document AFTER update
        );
        if (!updatedUserDoc) {
            return res.status(404).json({ message: "User not found", success: false });
        }
        const updatedUser = {
            id: updatedUserDoc.id,
            username: updatedUserDoc.username,
            email: updatedUserDoc.email,
            birthdate: updatedUserDoc.birthdate,
            gender: updatedUserDoc.gender,
            profileImage: updatedUserDoc.profileImage,
            createdAt: updatedUserDoc.createdAt,
        }

        res.json({
            message: "Username updated successfully",
            success: true,
            user: updatedUser,
        });
    } catch (error) {
        console.log("Error updating the username:", error);
        res.status(500).json({ message: `Internal server error`, success: false });
    }
}

export const changeEmail = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) return res.status(400).json({ message: "Email is requied", success: false });

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Please enter a valid email address." });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) return res.status(400).json({ message: "Email already exits.", success: false });
        // console.log("existsmail: ", existingEmail);
        // console.log("ID: ", req.user._id);
        // ID: new ObjectId('6946335bb859902476971e6d')
        // result: {
        //     acknowledged: true,
        //     modifiedCount: 1,
        //     upsertedId: null,
        //     upsertedCount: 0,
        //     matchedCount: 1
        // }

        const updatedUserDoc = await User.findByIdAndUpdate(
            req.user._id,
            { email },
            { new: true }
        );
        if (!updatedUserDoc) {
            return res.status(404).json({ message: "User not found", success: false });
        }
        const updatedUser = {
            id: updatedUserDoc.id,
            username: updatedUserDoc.username,
            email: updatedUserDoc.email,
            birthdate: updatedUserDoc.birthdate,
            gender: updatedUserDoc.gender,
            profileImage: updatedUserDoc.profileImage,
            createdAt: updatedUserDoc.createdAt,
        }

        res.json({
            message: "Email updated successfully",
            success: true,
            user: updatedUser,
        });
    } catch (error) {
        console.log("Error updating the email:", error);
        res.status(500).json({ message: `Internal server error`, success: false });
    }
}

export const changeGender = async(req,res,next) => {
    try {
        const { gender } = req.body;

        //validation
        const validGenders = ['Male', 'Female', 'Other', 'Prefer not to say'];
        if (!validGenders.includes(gender)) {
            return res.status(400).json({ message: "Please select a valid gender option." });
        }

        const updatedUserDoc = await User.findByIdAndUpdate(
            req.user._id,
            { gender },
            { new: true } // Returns the document AFTER update
        );
        if (!updatedUserDoc) {
            return res.status(404).json({ message: "User not found", success: false });
        }
        const updatedUser = {
            id: updatedUserDoc.id,
            username: updatedUserDoc.username,
            email: updatedUserDoc.email,
            birthdate: updatedUserDoc.birthdate,
            gender: updatedUserDoc.gender,
            profileImage: updatedUserDoc.profileImage,
            createdAt: updatedUserDoc.createdAt,
        }

        res.json({
            message: "Gender updated successfully",
            success: true,
            user: updatedUser,
        });
    } catch (error) {
        console.log("Error updating the gender:", error);
        res.status(500).json({ message: `Internal server error`, success: false });
    }
}
