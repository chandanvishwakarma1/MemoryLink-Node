import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    birthdate:{
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 10,
    },
    profileImage: {
        type: String,
        default: "",
    },
    hasOnBoarded: {
        type: Boolean,
        default: false,
    },
}, {timestamps: true});

//Hash the password before saving the user
userSchema.pre("save", async function() {
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
})

//Compare password  func
userSchema.methods.comparePassword = async function(userPassword) {
    return await bcrypt.compare(userPassword, this.password);
}

const User = mongoose.model('User', userSchema);
export default User;
