import type { UserInput } from "../schemas/user.schema.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import type { Request, Response, NextFunction } from "express";

const registerUser = asyncHandler(async (req: Request, res: Response) => {

    const {fullName, username, email, password}: UserInput = req.body

    return res.status(202).json({
        message: 'controller succesful'
    })
})

export {registerUser}