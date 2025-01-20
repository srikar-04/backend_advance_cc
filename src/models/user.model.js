import mongoose, {Schema} from "mongoose";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt' // used for HASHING password

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true    // makes this field (username) "serchable" in database. Used for optimization
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullname: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    avatar: {
        type: String,  // cloudinary url is used here
        required: true,
    },
    coverImage: {
        type: String,
    },
    watchHistory: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Video',
        }
    ],
    password: {  // coming back to this for the "type" discussion
        type: String,
        required: [true, 'Password is a required field']
    },

    // A refresh token is a long-lived credential issued to a user alongside an access token during authentication. It is used to request a new access token when the current one expires, without requiring the user to re-authenticate.
    
    refreshToken: { 
        type: String
    }

}, {timestamps: true})

userSchema.pre("save", async function(next) {
    // the conditionaning below ensures that, hashing is performed only when "password" field changes but not other fields. suppose if there is any change in any other field lets say avatar, the control, as expected goes to "pre" hook and the password is hashed again which is not a good thing. So if there is no modification in 'PASSWORD FIELD' then the password "should not be hashed" and the control should return back. this is done by the logic written below

    if(!this.isModified("password")) return next()    

    this.password = await bcrypt.hash(this.password, 10) // the number defines the number of rounds (Google to know more)
    
    next()
})

userSchema.methods.isPasswordCorrect = async function(password) {

    // the first argument is the original password send by the user whenever he calls the function and the second argument is the hashed password

   return await bcrypt.compare(password, this.password) // this is for decrypting the password

   // this returns true or false

}

userSchema.methods.generateAcessToken = function() {
    return jwt.sign(
        {
            _id: this._id,  // this id is present in DB
            email: this.email,
            username: this.username,
            fullname: this.fullname
        },
        process.env.ACESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        {
            _id: this._id,  // this id is present in DB
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema);