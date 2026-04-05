import User from "../Models/User.js";
import Timeline from '../Models/Timelines.js'
import Memory from "../Models/Memory.js";

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
        //

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

        //member size check
        if (validatedMembers.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please add atleast one member to create a timeline"
            })
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

export const getTimelines = async (req, res, next) => {
    try {
        const userId = req.user.id;

        // Query parameters with defaults
        const {
            page = 1,
            limit = 10,
            sortBy = 'createdAt',
            sortOrder = 'desc',
            privacy,
            role,
            search
        } = req.query;

        // Validation
        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
        const skip = (pageNum - 1) * limitNum;

        // Validate sort fields
        const validSortFields = ['createdAt', 'updatedAt', 'name'];
        if (!validSortFields.includes(sortBy)) {
            return res.status(400).json({
                success: false,
                message: `Invalid sort field. Valid fields are: ${validSortFields.join(', ')}`
            });
        }

        // Validate sort order
        const validSortOrders = ['asc', 'desc'];
        if (!validSortOrders.includes(sortOrder.toLowerCase())) {
            return res.status(400).json({
                success: false,
                message: `Invalid sort order. Valid orders are: ${validSortOrders.join(', ')}`
            });
        }

        // Build query - find timelines where user is a member
        const query = {
            'members.user': userId
        };

        // Add privacy filter if provided
        if (privacy) {
            const validPrivacies = ['public', 'private', 'invite-only'];
            if (!validPrivacies.includes(privacy)) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid privacy setting. Valid options are: ${validPrivacies.join(', ')}`
                });
            }
            query.privacy = privacy;
        }

        // Add role filter if provided
        if (role) {
            const validRoles = ['owner', 'admin', 'member'];
            if (!validRoles.includes(role)) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid role. Valid roles are: ${validRoles.join(', ')}`
                });
            }
            query['members.$elemMatch'] = {
                user: userId,
                role: role
            };
            // Remove the simpler members.user query since we're using elemMatch
            delete query['members.user'];
        }

        // Add search filter if provided
        if (search && search.trim()) {
            query.$or = [
                { name: { $regex: search.trim(), $options: 'i' } },
                { description: { $regex: search.trim(), $options: 'i' } }
            ];
        }

        // Execute query with pagination
        const sortOption = { [sortBy]: sortOrder.toLowerCase() === 'desc' ? -1 : 1 };

        const [timelines, total] = await Promise.all([
            Timeline.find(query)
                .sort(sortOption)
                .skip(skip)
                .limit(limitNum)
                .populate('members.user', 'username fullName profileImage email')
                .lean(),
            Timeline.countDocuments(query)
        ]);

        // Add user's role in each timeline
        const timelinesWithRole = timelines.map(timeline => {
            const userMember = timeline.members.find(m => m.user._id.toString() === userId);
            const { members, ...timelineData } = timeline;

            return {
                ...timelineData,
                myRole: userMember?.role || 'member',
                memberCount: members.length,
                // Optionally include limited member info
                recentMembers: members.slice(0, 5).map(m => ({
                    id: m.user._id,
                    username: m.user.username,
                    fullName: m.user.fullName,
                    profileImage: m.user.profileImage,
                    role: m.role,
                    joinedAt: m.joinedAt
                }))
            };
        });

        res.json({
            success: true,
            data: timelinesWithRole,
            pagination: {
                currentPage: pageNum,
                totalPages: Math.ceil(total / limitNum),
                totalItems: total,
                itemsPerPage: limitNum,
                hasNextPage: pageNum < Math.ceil(total / limitNum),
                hasPrevPage: pageNum > 1
            }
        });



    } catch (error) {
        console.error("Error fetching timelines:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error while fetching timelines"
        });
    }
}

export const getTimelineById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const timeline = await Timeline.findOne({
            _id: id,
            'members.user': userId
        }).populate('members.user', 'username fullName profileImage email');

        if (!timeline) {
            return res.status(404).json({
                success: false,
                message: "Timeline not found or you don't have access"
            });
        }


        const {
            page = 1,
            limit = 10,
            sortBy = 'createdAt',
            sortOrder = 'desc',
        } = req.query;
        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
        const skip = (pageNum - 1) * limitNum;

        const sortOptions = {
            [sortBy]: sortOrder.toLowerCase() === 'desc' ? -1 : 1
        }

        const [memories, total] = await Promise.all([
            Memory.find({ timelineId: id })
                .sort(sortOptions)
                .skip(skip)
                .limit(limitNum)
                .populate('userId', 'username profileImage')
                .lean(),
            Memory.countDocuments({ timelineId: id })
        ]);

        const userMember = timeline.members.find(m => m.user._id.toString() === userId);

        res.json({
            success: true,
            data: {
                ...timeline.toObject(),
                myRole: userMember.role,
                memories: memories,
                pagination: {
                    currentPage: pageNum,
                    totalPages: Math.ceil(total / limitNum),
                    totalItem: total,
                    itemsPerPage: limitNum,
                    hasNextPage: pageNum < Math.ceil(total / limitNum),
                    hasPrevPage: pageNum > 1
                }
            }
        });

    } catch (error) {
        console.error("Error fetching timeline:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export const deleteTimeline = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // Only owner can delete timeline
        const timeline = await Timeline.findOneAndDelete({
            _id: id,
            ownerId: userId
        });

        if (!timeline) {
            return res.status(404).json({
                success: false,
                message: "Timeline not found or you're not the owner"
            });
        }

        res.json({
            success: true,
            message: "Timeline deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting timeline:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}