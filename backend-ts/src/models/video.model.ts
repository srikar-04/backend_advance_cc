import mongoose, { Schema, Types, type HydratedDocument, type InferSchemaType} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

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
        default: 0,
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

videoSchema.plugin(mongooseAggregatePaginate)

export type VideoSchemaType = InferSchemaType<typeof videoSchema>;

export type VideoDocument = HydratedDocument<VideoSchemaType>

export const Video = mongoose.model<VideoSchemaType>("Video", videoSchema);