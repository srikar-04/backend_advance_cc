import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import connectDB from "./db/index.js";
import { exit } from "process";

const PORT = process.env.PORT || 3000

// code for connecting database and "server level error handling"

connectDB()
.then(() => {
    const server = app.listen(PORT)

    server.on('connect', () => {
        console.log(`app is listening on port ${PORT}`);
    })

    server.on('error', () => {
        console.error('server error occured');
    })

    server.on('close', () => {
        console.warn('server closed !!');
        
    })
})
.catch((err) => {
    console.error('mongodb connection failed : ', err)
    exit(1)
})