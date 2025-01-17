import express from 'express'
import cookieParser from 'cookie-parser';
import cors from 'cors';


const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


// routes importing

import userRouter from "./routes/user.routes.js"

//routes declaration
// WE SHOULD USE A MIDDLEWARE TO USE THE ROUTES

app.use('/api/v1/users', userRouter) // when the user types /users then the control reaches to the userRouter file and all the routes of the user are handled there

// this will be the route
// http://localhost:8000/api/v1/users/register

export { app }