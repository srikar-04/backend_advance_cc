import { user, type UserInput } from "../schemas/user.schema.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import type { Request, Response, NextFunction } from "express";
import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import type { IUser } from "../types/model_types.js";
import ApiResponse from "../utils/ApiResponse.js";
import {type UserDocument } from "../types/model_types.js";
import type { ObjectId } from "mongodb";
import jwt from "jsonwebtoken"

export const generateAccessTokenAndRefreshToken = async (userId: ObjectId) => {

    const registeredUser: UserDocument | null = await User.findById(userId)

    if(!registeredUser) throw new ApiError(404, "user not found while generating access and refresh tokens")

    const accessToken = registeredUser.generateAccessToken()
    const refreshToken = registeredUser.generateRefreshToken()

    registeredUser.refreshToken = refreshToken
    await registeredUser.save({validateBeforeSave: false})

    return {accessToken, refreshToken}
}

const registerUser = asyncHandler(async (req: Request, res: Response) => {

    // steps to be followed : 
    // get user details from res.locals.validated
    // check if the user is already present in db
    // upload files, in local server, to cloudinary
    // create new user in db

    const {username, email, password, fullName} = res.locals.validated.body as UserInput

    const exsistedUser = await User.findOne({
        $or: [{username}, {email}]
    })

    if(exsistedUser) {
        throw new ApiError(409, 'User with email or username already exsists')
    }

    let avatarLocalPath: string | undefined = ''
    let coverImageLocalPath: string | undefined = ''
    // explanation for this is present in the user.routes.ts file on top of the register route
    if (!Array.isArray(req.files)) {
        const filesMap = req.files as { [field: string]: Express.Multer.File[] };
        avatarLocalPath = filesMap.avatar?.[0]?.path;
        coverImageLocalPath = filesMap.coverImage?.[0]?.path
    }

    if(!avatarLocalPath) throw new ApiError(400, 'avatar is not in local server')

    const cloudinaryResponse = await uploadOnCloudinary(avatarLocalPath)

    if(!cloudinaryResponse.success)  {
        throw new ApiError(400, cloudinaryResponse.error)
    }

    let coverImageUrl = ""

    if(coverImageLocalPath) {
        const coverImageCloudinaryResponse = await uploadOnCloudinary(coverImageLocalPath)
        if(!coverImageCloudinaryResponse.success)  {
            throw new ApiError(400, coverImageCloudinaryResponse.error)
        }
        coverImageUrl = coverImageCloudinaryResponse.data.url
    }

    const newUser: IUser = {
        username,
        email,
        fullName,
        password,
        avatar: cloudinaryResponse.data.url,
        coverImage: coverImageUrl
    }

    const user = await User.create(newUser)

    const createdUser = await User.findById(user._id).lean().select(
        '-password -refreshToken'
    )

    if(!createdUser) throw new ApiError(500, 'user not present in db')

    return res.status(201).json(
        new ApiResponse(200, createdUser, 'user registered successfuly')
    )
})

const loginUser = asyncHandler(async (req: Request, res: Response) => {
    // get user details, like username, email etc..., from req.body
    // validate the obtained data
    // check if the user is registered or not. that means check if user is logging in without registration
    // generate accesstoken and refreshtoken
    // add the refresh token in db for validation
    // send access-token in the response (can be stored in a react redux state in frontend). send refresh-token in cookies (which frontend cannot access)

    const { username, email, password }: {
        username: string,
        email: string,
        password: string
    } = req.body

    if(!username?.trim() && !email?.trim()) {
        throw new ApiError(400, "username or email are required")
    }

    const registeredUser: UserDocument | null = await User.findOne({
        $or: [{email}, {username}]
    })

    if(!registeredUser) {
        throw new ApiError(404, "User is not registred")
    }

    const passwordCheck = await registeredUser.verifyPassword(password)

    if(!passwordCheck) {
        throw new ApiError(422, "password is incorrect")
    }

    let {accessToken, refreshToken} = await generateAccessTokenAndRefreshToken(registeredUser._id)

    const loggedinUser = await User.findById(registeredUser._id).lean().select('-password -refreshToken')

    const options = {
        httpOnly: true,
        secure: true,
    }

    res
    .status(200)
    .cookie('refreshToken', refreshToken, options)
    .cookie('accessToken', accessToken, options)
    .json(
        new ApiResponse(
            200,
            {
                ...loggedinUser,
                accessToken   // NOTES BELOW
            },
            "user logged-in successfully"
        )
    )

    // the accessToken sent in the json response goes to the frontend and it is stored in react state (using react-redux or anything)
    // whenever there is a need to hit the authorized routes, we will send the accessToken in the bearer header
    // then the real question is then why are we sendin accessToken in cookies also?
    // because when react app reloads we loose the state, that's why we send it in cookie also

})

const logoutUser = asyncHandler( async (req: Request, res:Response, next: NextFunction) => {


    const token = req.cookies?.refreshToken

    const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        maxAge: 0
    };

    if(!REFRESH_TOKEN_SECRET) throw new ApiError(401, 'refresh token secret not found')

    let payload: any;

    try {
        payload = jwt.verify(token, REFRESH_TOKEN_SECRET)
    } catch (error) {
        if(error instanceof jwt.JsonWebTokenError) {
            if(error.name === "TokenExpiredError") {
                return res.json(new ApiResponse(200, 'user logged out'))
            }
            return res.json(new ApiResponse(200, 'user logged out'))
        }
        return res.json(new ApiResponse(200, 'user logged out'))
    }

    await User.findByIdAndUpdate(
        payload._id,
        {
            $set: {
                refreshToken: "",
            },
        },
        {
            new: true,
        }
    )

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "user logged out"));
})

export {
    registerUser,
    loginUser,
    logoutUser
}