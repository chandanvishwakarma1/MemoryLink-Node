import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: function() { return this.status === 'active'; },
    },
    username: {
        type: String,
        required: function() { return this.status === 'active'; },
        unique: true,
        sparse: true,
        trim: true,
        lowercase: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    birthdate: {
        type: Date,
        required: function() { return this.status === 'active'; },
        // immutable: true,
    },
    gender: {
        type: String,
        required: function() { return this.status === 'active'; },
    },
    password: {
        type: String,
        required: function() { return this.status === 'active'; },
        minlength: 10,
    },
    profileImage: {
        type: String,
        default: "",
    },
    status: {
        type: String,
        enum: ['waitlist', 'approved',  'active'],
        default: 'waitlist',
    },
    approvedAt: {
        type: Date,
    },
    hasOnBoarded: {
        type: Boolean,
        default: false,
    },
    hasAcceptedTermsAndPrivacy: {
        type: Boolean,
        required: function() { return this.status === 'active'; },
        // immutable: true,
    },
    termsAcceptedAt: {
        type: Date,
        required: function() { return this.status === 'active'; },
        // immutable: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },

    verifiedAt: {
        type: Date,
    },
}, { timestamps: true });

//Hash the password before saving the user
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
})

//Compare password  func
userSchema.methods.comparePassword = async function (userPassword) {
    return await bcrypt.compare(userPassword, this.password);
}

const User = mongoose.model('User', userSchema);
export default User;
