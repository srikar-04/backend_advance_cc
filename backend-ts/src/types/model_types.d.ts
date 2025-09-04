import type { HydratedDocument, Types, Model } from "mongoose"

export interface IUser {
    username: string
    email: string
    password: string
    refreshToken?: string
    fullName: string
    watchHistory?:Types.ObjectId[]
    avatar?: string,
    coverImage?: string
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