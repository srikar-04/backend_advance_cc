import { asyncHandler } from "../utils/asyncHandler.js";
import type { Request, Response, NextFunction } from "express";

const registerUser = asyncHandler(async (req: Request, res: Response) => {
    return res.status(202).json({
        message: 'controller succesful'
    })
})

export {registerUser}