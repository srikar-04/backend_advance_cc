import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        trim: true,
        lowercase: true,
        index: true,
        unique: true
    },
    videoFile: {
        type: String, // string from cloudinary url
        required: true
    },
    thumbnail: {
        type: String, // string from cloudinary url
        required: true
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },

    // when a video is uploaded on platforms like cloudinary they inreturn gives us the information of the video like the url of the video etc.. in the same way we also get the information about duration of the video

    duration: {
        type: Number,
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    isPublished: {
        type: Boolean,
        default: true
    }
}, {timestamps: true});

// pagination is the process of breaking large amount of data into small chunks. example if we have 1000 videos then we paginate the data and show only 10 or 15 videos at a single time

videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video", videoSchema)