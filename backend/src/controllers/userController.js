import User from "../Models/User.js";

export const validateUsername = async (req,res,next) => {
    try {
        const {profileImage, username, email} = req.body;
        // console.log("user:", username);
        const isAvailable = await User.exists({username});
        if(isAvailable) return res.status(400).json({ message: "Username already taken", success: false });

        res.json({
            message: "Username available",
            success: true
        })
    } catch (error) {
        console.log("Error validating username: ", error);
        res.status(401).json({message: "Token is not valid", success: false})
    }
}