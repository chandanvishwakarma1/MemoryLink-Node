import User from "../Models/User.js";
import Timeline from '../Models/Timelines.js'

export const createTimeline = async (req, res, next) => {
    try {
        const { name, description, members } = req.body;
        const ownerId = req.user.id;

        // Validation
        if (!name || name.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Timeline name is required'
            });
        }

        if (name.length > 50) {
            return res.status(400).json({
                success: false,
                message: 'Timeline name cannot exceed 50 characters'
            });
        }

        if (description && description.length > 200) {
            return res.status(400).json({
                success: false,
                message: 'Description cannot exceed 200 characters'
            });
        }

        // Validate members array if provided
        let validatedMembers = [];

        if (members && Array.isArray(members)) {
            // Check for duplicate members
            const uniqueMembers = [...new Set(members.map(m => m.userId))];
            if (uniqueMembers.length !== members.length) {
                return res.status(400).json({
                    success: false,
                    message: 'Duplicate members not allowed'
                });
            }

            // Validate each member exists and get their details
            for (const member of members) {
                const user = await User.findById(member.userId);
                if (!user) {
                    return res.status(404).json({
                        success: false,
                        message: `User with ID ${member.userId} not found`
                    });
                }

                validatedMembers.push({
                    user: member.userId,
                    role: member.role || 'member'
                });
            }
        }


        //checking if timeline alredy exists
        //anti-spam check
        const tenSecondsAgo = new Date(Date.now() - 10000);
        const duplicateSpam = await Timeline.findOne({
            name: name.trim(),
            ownerId: ownerId,
            createdAt: { $gte: tenSecondsAgo }
        });

        if (duplicateSpam) {
            return res.status(400).json({
                success: false,
                message: 'You just created a timeline with this name. Please wait a moment.'
            });
        }

        const newTimeline = await Timeline.create({
            name: name.trim(),
            description: description?.trim(),
            ownerId,
            members: [
                {
                    user: ownerId,
                    role: 'owner'
                },
                ...validatedMembers
            ]
        });

        res.json({
            message: "Timeline Created",
            success: true,
            data: newTimeline
        })
    } catch (error) {
        console.log("Error creating timeline", error);
        res.status(500).json({ message: `Internal server error`, success: false })
    }
}