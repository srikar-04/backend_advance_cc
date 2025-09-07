import cors from 'cors'
import cookieParser from 'cookie-parser';
import express, { type Request, type Response, type Express } from "express";
import userRouter from "./routes/user.routes.js"

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

export default app