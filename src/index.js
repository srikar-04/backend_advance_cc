import connectDB from "./db/index.js";
import dotenv from 'dotenv'

dotenv.config({
    path: './env'
})

connectDB()





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