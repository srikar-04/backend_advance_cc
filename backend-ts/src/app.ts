import cors from 'cors'
import cookieParser from 'cookie-parser';
import express, { type Request, type Response, type Express } from "express";

const app = express()

app.use(express.json())

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(cookieParser())

export default app