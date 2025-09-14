import type { Request, Response, NextFunction } from "express"
import ApiError from "../utils/ApiError.js"
import jwt from "jsonwebtoken"
import type { Types } from "mongoose"
import { User } from "../models/user.model.js"

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {

        // 1) get token from Authorization header (case-insensitive)
        const authHeader = (req.get('authorization') || '') as string;
        let token: string | undefined;

        const bearerMatch = authHeader.match(/Bearer\s+(.+)/i);
        if (bearerMatch) {
            token = bearerMatch[1];
        }

        // 2) fallback to cookie only if your app uses cookie-stored access tokens
        // NOTE: prefer Authorization header + in-memory access token for SPAs.
        if (!token && req.cookies?.accessToken) {
            token = req.cookies.accessToken;
        }

        if (!token) {
            throw new ApiError(401, 'Unauthorized: access token missing')
        }

        const {ACCESS_TOKEN_SECRET} = process.env

        if(!ACCESS_TOKEN_SECRET) throw new ApiError(401, 'token secret not found')
        
        let payload: any;

        try {
            payload = jwt.verify(token, ACCESS_TOKEN_SECRET) as {
                _id: Types.ObjectId,
                username: string,
                email: string
            }
        } catch (error) {
            if(error instanceof jwt.JsonWebTokenError) {
                if(error.name === "TokenExpiredError") {
                    throw new ApiError(401, 'access token expired')
                }
                throw new ApiError(401, 'invalid access token')
            }
            throw new ApiError(401, 'invalid access token')
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
        console.error("Auth middleware error : ", error)
        // If it's already an ApiError, re-throw it
        if (error instanceof ApiError) {
            throw error
        }   
        // Handle any other unexpected errors
        throw new ApiError(500, "Internal server error")
    }
}