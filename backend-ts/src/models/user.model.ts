import mongoose, { Schema, Types, type HydratedDocument, type InferSchemaType, type CallbackWithoutResultAndOptionalError} from "mongoose";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

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


// IMPORTANT : -->> THIS IS NOT A FUCKING EXPRESS MIDDLEWARE <<---

// Like in express, the next() function here does not mean to end the function execution and return to the next middleware call.
// instead it tells mongoose that the execution of this hook is completed. That's it
// and it does not stop the execution of the later function body.
// that is the reason to use return with next in the if condition (end function + indicate the completion of hook)
userSchema.pre("save", async function(this: UserDocument, next: CallbackWithoutResultAndOptionalError) {
    if(!this.isModified('password')) return next()

    this.password = await bcrypt.hash(this.password as string, 10)
    next()
})

export const User = mongoose.model<UserSchemaType>("User", userSchema);