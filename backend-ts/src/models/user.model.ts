import mongoose, { Schema, Types, type InferSchemaType} from "mongoose";

// define the schema
const userSchema = new Schema({
    // define the fields
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: String
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    watchHistory: [
        {
            type: Types.ObjectId,
            ref: 'Video'
        }
    ],
    avatar: String,
    coverImage: String

}, {timestamps: true});

type userSchemaType = InferSchemaType<typeof userSchema>;


export const User = mongoose.model<userSchemaType>("User", userSchema);