import mongoose from "mongoose";
import { DB_NAME } from "./constants";
import express from 'express'








/*
// THIS IS ONE OF THE PROCESSES OF CONNECTING A DB
const app = express();
( async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error", (error) => {
            console.log('ERROR : ', error);
            throw error
        })

        app.listen(process.env.PORT, () => {
            console.log(`app is listening on ${process.env.PORT}`);
        })

    } catch (error) {
        console.error('ERROR : ', error)
        throw error
    }
})() */