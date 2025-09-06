import type { HydratedDocument, Types, Model } from "mongoose"
import type { UserInput } from "../schemas/user.schema.ts"
import type { VideoInput } from "../schemas/video.schema.ts"

export interface IUser extends UserInput {
    watchHistory?:Types.ObjectId[]
    createdAt?: Date;
    updatedAt?: Date;
}

export type UserDocument = HydratedDocument<IUser, IUserMethods>

export type UserModel = Model<IUser, {}, IUserMethods>;

export interface IUserMethods {
    generateAccessToken(this: UserDocument): string
    generateRefreshToken(this: UserDocument): string
    verifyPassword(this: UserDocument, password: string): Promise<boolean>
}


export interface IVideo extends VideoInput{
    owner?: Types.ObjectId
}

export type VideoDocument = HydratedDocument<IVideo>