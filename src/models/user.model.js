import mongoose, {Schema} from "mongoose";

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

export const User = mongoose.model("User", userSchema);