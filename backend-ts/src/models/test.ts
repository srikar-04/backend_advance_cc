import mongoose, { Schema, model, Document, Model } from "mongoose";

// 1. Define the base interface (without Document)
interface IUser {
    name: string;
    email: string;
    password: string;
    image?: string; // Optional field
    createdAt?: Date;
    updatedAt?: Date;
}

// 2. Extend with Document for Mongoose documents
interface IUserDocument extends IUser, Document {}

// 3. Define the schema (without generic type)
const userSchema = new Schema<IUserDocument>({
    name: {
        type: String,
        unique: true,
        required: true,
        trim: true
    }
}, {
    timestamps: true
});

// 4. Create the model with proper typing
const User: Model<IUserDocument> = model<IUserDocument>("User", userSchema);

// 5. Export types for use in other files
export type { IUser, IUserDocument };
export default User;