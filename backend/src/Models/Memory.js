import mongoose from 'mongoose'

const memoryModelScheme = new mongoose.Schema({
    timelineId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        maxLength: 100,
    },
    description: {
        type: String,
        maxLength: 500,
    },
    mediaUrl: {
        type: String,
        required: true
    },
    mediaType: {
        type: String,
        required: true,
        enum: ['image/jpeg', 'video/mp4', 'audio/mp3', 'audio/mpeg']
    }
}, { timestamps: true });

const Memory = mongoose.model('Memory', memoryModelScheme);
export default Memory;