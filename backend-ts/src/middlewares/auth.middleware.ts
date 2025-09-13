import type { Request, Response, NextFunction } from "express"
import ApiError from "../utils/ApiError.js"
import jwt from "jsonwebtoken"
import type { Types } from "mongoose"
import { User } from "../models/user.model.js"

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const token = req.header("Authorization")?.replace("Bearer ", "") || req.cookies?.accessToken

        if(!token) {
            throw new ApiError(401, 'unauthorized request')
        }

        const {ACCESS_TOKEN_SECRET} = process.env

        if(!ACCESS_TOKEN_SECRET) throw new ApiError(401, 'token secret not found')
        
        const payload = jwt.verify(token, ACCESS_TOKEN_SECRET) as {
            _id: Types.ObjectId,
            username: string,
            email: string
        }
    
        const userId = payload._id
    
        // .exec() is used for better debugging
        const foundUser = await User.findById(userId).lean().select('-password -refreshToken').exec()
    
        if(!foundUser) {
            throw new ApiError(401, "user not found")
            // redirect to login page
            // generate new access token and refresh token
            // store them in cookies
        }

        res.locals.user = foundUser
        
        next()

    } catch (error) {
        console.error(error)
        throw new ApiError(401, 'invalid/expired token')
    }
}