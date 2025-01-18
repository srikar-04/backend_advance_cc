import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"

const generateAcessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const acessToken = user.generateAcessToken()
        const refreshToken = user.generateRefreshToken()

        // adding and saving the refresh token into database
        user.refreshToken = refreshToken
        // the validateBeforeSave prevents all the fields to be validated by the DB, In short it prevents from refreshing all the fields
        await user.save({validateBeforeSave: false})

        return {acessToken, refreshToken}

    } catch (error) {
        throw new ApiError(500, "something went wrong while generating acess and refresh token")
    }
}

const registerUser = asyncHandler( async (req, res) => {
    // STEPS FOR USER REGISTRATION :
    // get user details from frontend
    // validation about user details
    // check if user already exsist: can check with username or email
    // check for images, check for avatar(avatar is required)
    // upload them to cloudinary, check if avatar is uploaded
    // create user object - create entry in DB
    // remove password and refresh token field from response
    // check for user creation
    // return response(res)

    // getting details of user from body(like form submissions or any other submissions)
    const {fullname, email, username, password} = req.body
    // console.log("fullname", fullname);

   if(
    [fullname, email, username, password].some( (field) => field?.trim() === "")
   ) {
        throw new ApiError(400, "All Fields Are Required")
   }

    // finding a user whith the specified username or email
    const exsistedUser = await User.findOne({
        $or: [{username}, {email}]
    })
    // console.log(exsistedUser);

    // if that username or email exsists that throw an error
    if(exsistedUser) {
        throw new ApiError(409, "user already exsists")
    }

    // console.log(req.files); // UNCOMMENT THIS WHILE RUNNING PROJECT
    
    //multer middleware modifies the req object and gives us acess to req.files, which have coverImage, avatar etc
    const avatarLocalPath = req.files?.avatar[0]?.path

    //const coverImageLocalPath = req.files?.coverImage[0]?.paths

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

    if(!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    // check if avatar is sucesfully uploaded on cloudinary and returns avatars inforamtion
    if(!avatar) {
        throw new ApiError(400, "Avatar is required")
    }

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        // cover image is not a required field and we have not done any check before. SO we are checking here. If it is not available then storean empty string
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })
    console.log(user, "sucesfully created a user, from `user.controller.js file`");
    

    // this checks if the user is created inside DB. to check this we call the db with the id of the user(created above) which tells us if the user with that id is present or not(using findById method).even if the user is not created we should remove password and acesstoken from our local server
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser) {
        throw new ApiError(500, "something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registerd sucesfully")
    )

} )


const loginUser = asyncHandler( async (req, res) => {
    // STEPS FOR LOGINING A USER
    // getting user details from frontend from req-> body
    // check if username or email is given or not
    // find the user
    // password check
    // generate acess and refresh token
    // send cookie (acess and refresh token)
    // send res

    const {username, password, email} = req.body

    if(!username || !email) {
        throw new ApiError(400, "username or password is required")
    }

    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if(!user) {
        throw new ApiError(404, "User doesnot exsists")
    }

    // checking if the password enterd by the user while logging in is same as password in the db that he has enterd while registering
    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials")
    }

    const {acessToken, refreshToken} = await generateAcessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).
    select("-password -refreshToken")

    // sending cookies
    const options = {
        httpOnly: true,
        secure: true,
    }

    return res
    .status(200)
    .cookie("acessToken", acessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: acessToken, loggedInUser, refreshToken
            },
            "user logged in seucesfully"
        )
    )

})

export {
    registerUser,
    loginUser
}