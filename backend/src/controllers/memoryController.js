import Memory from "../Models/Memory.js";

export const createMemory = async(req,res,next)=>{
    try {
        const {timelineId, title, description, mediaUrl, mediaType} = req.body;

        if(!timelineId || !title || !description || !mediaUrl || !mediaType) return res.status(400).json({ message : "All fiels are required"})
// const timelineId = req.params.timelineId;
        const newMemory = new Memory({
            timelineId,
            userId: req.user._id,
            title,
            description,
            mediaUrl,
            mediaType
        })

        await  newMemory.save();
        res.status(201).json({
            message: "Memory created successfully",
            success: true
        })
    } catch (error) {
        console.log("Error creating memory", error);
        res.status(500).json({
            message: "Memory creation was not successfull",
            success: false
        })
    }
}