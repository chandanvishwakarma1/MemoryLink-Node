import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const timelineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50,
    },
    description: {
        type: String,
        trim: true,
        maxlength: 200,
    },
    ownerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    members: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        role: {
            type: String,
            enum: ['owner', 'admin', 'member'],
            default: 'member'
        },
        joinedAt: {
            type: Date,
            default: Date.now
        }
    }],
        // permissions: {
        //     canAddCapsules: { type: Boolean, default: true },
        //     canEditCapsules: { type: Boolean, default: false },
        //     canDeleteCapsules: { type: Boolean, default: false },
        //     canInviteMembers: { type: Boolean, default: false }
        // }
        privacy: {
            type: String,
            enum: ['public', 'private', 'invite-only'],
            default: 'private'
        },

}, { timestamps: true })

//
timelineSchema.path('members').validate(function(members) {
    const ownerCount = members.filter(m => m.role === 'owner').length;
    return ownerCount === 1;
}, 'Timeline must have exactly one owner');

timelineSchema.path('members').validate(function(members) {
    const uniqueUsers = new Set(members.map(m => m.user.toString()));
    return uniqueUsers.size === members.length;
}, 'Each user can only be a member once');

const Timeline = mongoose.model('Timeline', timelineSchema);
export default Timeline;

