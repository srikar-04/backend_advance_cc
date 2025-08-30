import dotenv from 'dotenv'
dotenv.config()
import mongoose from "mongoose";

export default async function connectDB() {
    try {
        const MONGODB_URI = process.env.MONGODB_URI
        const MONGODB_NAME = process.env.MONGODB_NAME
    
        if (!MONGODB_NAME || !MONGODB_URI) throw new Error('missing mongo db connection string or mongodb name')
    
        const connectionInstance = await mongoose.connect(`${MONGODB_URI}/${MONGODB_NAME}`)
        // console.log('connectionInstance', connectionInstance)
        // console.log('Data base connected successfully!!', connectionInstance.connection.host)

    } catch (error) {
        if (error instanceof Error) {
            console.error('Initial data base connection failed!! : ', error.message)
        } else {
            console.error('Initial data base connection failed!! : ', error)
        }
        process.exit(1)
    }
}

// connectDB()

mongoose.connection.on('error', (err) => {
    console.error('Database post connection error : ', err)
})

mongoose.connection.on('disconnected', () => {
    console.warn('Database disconnected!!')
})