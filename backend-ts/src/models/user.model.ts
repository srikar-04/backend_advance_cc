import mongoose, { Schema, Types, type HydratedDocument, type InferSchemaType} from "mongoose";

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

export type UserSchemaType = InferSchemaType<typeof userSchema>;

// hydrated document containing the methods, getters and setters
// the instance returned by the mongoose document will be of this type
export type UserDocument = HydratedDocument<UserSchemaType> 

export const User = mongoose.model<UserSchemaType>("User", userSchema);