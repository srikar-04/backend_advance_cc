import mongoose, { Schema, Types, type CallbackWithoutResultAndOptionalError} from "mongoose";


const subscriptionSchema = new Schema({
    subscriber: {
        type: Types.ObjectId,
        ref: "User",
    },
    channel: {
        type: Types.ObjectId,
        ref: "User",
    }
}, {timestamps: true})


export const Subscription = mongoose.model("Subscription", subscriptionSchema)