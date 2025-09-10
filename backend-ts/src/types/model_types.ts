import type { HydratedDocument, Types, Model } from "mongoose"
import type { UserInput } from "../schemas/user.schema.js"
import type { VideoInput } from "../schemas/video.schema.js"

export type IUser = Omit<UserInput, "watchHistory" | "avatar"> & {
    watchHistory?: Types.ObjectId[];  // DB stores ObjectId[]
    avatar: string;                   // DB expects the final avatar URL (required)
    createdAt?: Date;
    updatedAt?: Date;
};

export type UserDocument = HydratedDocument<IUser, IUserMethods>

export type UserModel = Model<IUser, {}, IUserMethods>;

export interface IUserMethods {
    generateAccessToken(this: UserDocument): string
    generateRefreshToken(this: UserDocument): string
    verifyPassword(this: UserDocument, password: string): Promise<boolean>
}

export type IVideo = Omit<VideoInput, "owner"> & {
    owner: Types.ObjectId
}


export type VideoDocument = HydratedDocument<IVideo>