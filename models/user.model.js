import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'user name is required'],
            trim: true,
            minlength: 5,
            maxlength: 50
        },
        email: {
            type: String,
            required: [true, 'user email is required'],
            unique: true,
            trim: true,
            lowercase: true,
            match: [/\S+@\S+\.\S+/, 'please enter a valid email address']
        },
        password:{
            type: String,
            required: [true, 'user password is required'],
            minlength: 5
        }

    }, {timestamps: true});

const User = mongoose.model('User', userSchema);

export default User;


