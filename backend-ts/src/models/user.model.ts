import mongoose, { Schema, Types, type CallbackWithoutResultAndOptionalError} from "mongoose";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { type IUser, type IUserMethods, type UserDocument, type UserModel } from "../types/model_types.js";

// define the schema
const userSchema = new Schema<IUser, UserModel, IUserMethods>({
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
    avatar: {
        type: String,
        required: true
    },
    coverImage: String

}, {timestamps: true});


// IMPORTANT : -->> THIS IS NOT A FUCKING EXPRESS MIDDLEWARE <<---

// Like in express, the next() function here does not mean to end the function execution and return to the next middleware call.
// instead it tells mongoose that the execution of this hook is completed. That's it
// and it does not stop the execution of the later function body.
// that is the reason to use return with next in the if condition (end function + indicate the completion of hook)
userSchema.pre("save", async function(
    this: UserDocument, next: CallbackWithoutResultAndOptionalError
) {
    if(!this.isModified('password')) return next()

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.verifyPassword = async function(this: UserDocument, password) {
    return await bcrypt.compare(password, this.password)
}

const {ACCESS_TOKEN_SECRET} = process.env

if (!ACCESS_TOKEN_SECRET) {
    throw new Error("ACCESS_TOKEN_SECRET is not defined");
}

userSchema.methods.generateAccessToken = function() {
 
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            email: this.email
        },
        ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
    )
}

userSchema.methods.generateRefreshToken = function() {

    const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET

    if(!REFRESH_TOKEN_SECRET) throw new Error('REFRESH_TOKEN is not defined')

    return jwt.sign(
        {
            _id: this._id,  // this id is present in DB
        },
        REFRESH_TOKEN_SECRET,
        {
            expiresIn: "10d"
        }
    )
}

export const User = mongoose.model<IUser, UserModel>("User", userSchema);