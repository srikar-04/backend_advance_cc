import type { Types } from "mongoose";
import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import type { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken'
import { User } from "../models/user.model.js";
import { generateAccessTokenAndRefreshToken } from "./user.controller.js";
import ApiResponse from "../utils/ApiResponse.js";


export const refreshTokens = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.refreshToken
    if(!token) {
        throw new ApiError(401, 'RefreshToken not found, unable to refresh')
    }

    let { REFRESH_TOKEN_SECRET } = process.env

    if(!REFRESH_TOKEN_SECRET) {
        throw new ApiError(404, 'refresh token secret not found')
    }

    let payload: any;
    try {
        payload = jwt.verify(token, REFRESH_TOKEN_SECRET) as {_id: Types.ObjectId}
    } catch (error) {
        if(error instanceof jwt.JsonWebTokenError) {
            if(error.name === "TokenExpiredError") {
                throw new ApiError(401, 'refresh token expired')
            }
            throw new ApiError(401, 'invalid refresh token')
        }
        throw new ApiError(401, 'invalid refresh token')
    }

    const userId = payload._id

    const foundUser = await User.findById(userId)

    if(!foundUser) {
        throw new ApiError(401, 'user not found and cannot refresh token')
    }

    // generating new refresh token
    // appending new refresh token to the user
    // saving the user - without doing validation checks

    const {accessToken, refreshToken} = await generateAccessTokenAndRefreshToken(foundUser._id)

    const options = {
        httpOnly: true,
        secure: true,
    }

    // setting refreshToken and accessToken in cookie
    res
    .status(200)
    .cookie('refreshToken', refreshToken, options)
    .cookie('accessToken', accessToken, options)
    .json(new ApiResponse(200, {}, 'Tokens refreshed successfully'))
})