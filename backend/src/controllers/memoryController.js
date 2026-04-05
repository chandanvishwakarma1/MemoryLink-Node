import Memory from "../Models/Memory.js";

export const createMemory = async (req, res, next) => {
    try {
        const { timelineId, title, description, mediaUrl, mediaType } = req.body;

        if (!timelineId || !title || !mediaUrl || !mediaType) return res.status(400).json({ message: "All fiels are required" })
        // const timelineId = req.params.timelineId;
        const newMemory = new Memory({
            timelineId,
            userId: req.user._id,
            title,
            description,
            mediaUrl,
            mediaType
        })

        await newMemory.save();
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

export const getMemories = async (req, res) => {
  try {
    const { timelineId } = req.params;

    const {
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc',
    } = req.query;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1,parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const sortOptions = {
        [sortBy] : sortOrder.toLowerCase() === 'desc' ? -1 : 1
    }
    
    const [memories, total] = await Promise.all([
        Memory.find({ timelineId })
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .populate('userId', 'username profileImage')
        .lean(),
        Memory.countDocuments({ timelineId })
    ]);

    
    res.json({ 
        success: true, 
        data: memories, 
        pagination: {
            currentPage: pageNum,
            totalPages: Math.ceil(total / limitNum),
            totalItem: total,
            itemsPerPage: limitNum,
            hasNextPage: pageNum < Math.ceil(total / limitNum),
            hasPrevPage: pageNum >  1
        } 
    });
  } catch (error) {
    console.log("error", error)
    res.status(500).json({ message: "Error fetching memories", success: false });
  }
}