import connectDB from "./db/index.js";
import dotenv from 'dotenv'

dotenv.config({
    path: './env'
})

connectDB()
.then(() => {

    app.on("error", (error) => {
        console.log('ERROR : ', error);
        throw error
    })

    app.listen(process.env.PORT || 8000, () => {
        console.log(`server is running at ${process.env.PORT}`);
    })
})
.catch((error) => {
    console.log("MongoDB Connection Failed!!!", error); 
})




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