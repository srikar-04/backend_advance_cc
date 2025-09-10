import type { UserInput } from "../schemas/user.schema.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import type { Request, Response, NextFunction } from "express";
import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import type { IUser } from "../types/model_types.js";
import ApiResponse from "../utils/ApiResponse.js";

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

export {registerUser}