import cors from 'cors'
import cookieParser from 'cookie-parser';
import express, { type Request, type Response, type Express, type NextFunction } from "express";
import userRouter from "./routes/user.routes.js"
import authRouter from './routes/auth.routes.js'
import ApiError from './utils/ApiError.js';
import ApiResponse from './utils/ApiResponse.js';

const app = express()

app.use(express.json())

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(cookieParser())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))

app.use('/api/v1/users', userRouter)
app.use('/api/v1/auth', authRouter)

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('Error caught by middleware:', err)
    
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json(
            new ApiResponse(err.statusCode, {}, err.message)
        )
    }
    
    // Handle unexpected errors
    return res.status(500).json(
        new ApiResponse(500, {}, 'Internal Server Error')
    )
})

export default app