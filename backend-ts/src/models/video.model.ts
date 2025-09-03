import mongoose, { Schema, Types, type InferSchemaType} from "mongoose";

// define the schema
const videoSchema = new Schema({
    // define the fields
    thumbnail: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    views: {
        type: Number,
        required: true
    },
    owner: {
        type: Types.ObjectId,
        ref: 'User'
    },
    duration: {
        type: Number,
        required: true
    },
    isPublished: {
        type: Boolean,
        required: true
    },
    videoFile: {
        type: String,
        required: true
    }
}, {timestamps: true});


type videoSchemaType = InferSchemaType<typeof videoSchema>;


export const Video = mongoose.model<videoSchemaType>("Video", videoSchema);