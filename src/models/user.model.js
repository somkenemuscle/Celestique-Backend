import mongoose from 'mongoose';
const { Schema } = mongoose;

// User Schema
const userSchema = new Schema({
    firstname: {
        type: String,
        required: [true, 'Firstname is required'],
        trim: true,
        minlength: [4, 'Firstname must be at least 4 characters long'],
        maxlength: [20, 'Firstname must be no more than 20 characters long'],
        match: [/^[a-zA-Z0-9._-]+$/, 'Firstname can only contain letters, numbers, dots, underscores, or dashes - schema']
    },
    lastname: {
        type: String,
        required: [true, 'Lastname is required'],
        trim: true,
        minlength: [4, 'Lastname must be at least 4 characters long'],
        maxlength: [20, 'Lastname must be no more than 20 characters long'],
        match: [/^[a-zA-Z0-9._-]+$/, 'Username can only contain letters, numbers, dots, underscores, or dashes - schema']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'User already exists'],
        trim: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Must be a valid email address with format "name@gmail.com - schema"']
    },
    phoneNumber: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
        match: [/^\d+$/, 'Phone number must contain only digits'],
        minlength: [10, 'Phone number must be at least 10 digits long'],
        maxlength: [15, 'Phone number must not exceed 15 digits']
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);

