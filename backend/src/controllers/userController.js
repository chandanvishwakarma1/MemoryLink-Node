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

export const changeUsername = () => {

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

        const result = await User.updateOne({ _id: req.user._id }, { $set: { email } });
        // Verify update success
        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: "User not found or email is the same", success: false });
        }
        res.json({ message: "Email updated successfully", success: true });
    } catch (error) {
        console.log("Error updating the email:", error);
        res.status(500).json({ message: `Internal server error`, success: false });
    }
}
