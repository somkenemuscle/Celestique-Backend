import mongoose from 'mongoose';
const { Schema } = mongoose;

// User Schema
const genderSchema = new Schema({
    gender: {
        type: String,
        required: [true, 'Gender is required'],
        unique: [true, 'Gender already exists'],
        trim: true
    }
}, { timestamps: true });

export const Gender = mongoose.model('Gender', genderSchema);