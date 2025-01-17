import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

//fs.unlink to unlink the file from local server

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            return null
        }
        //upload file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'
        })
        //file has been sucesfully uploaded
        console.log("file is uploaded on cloudinary : ", response.url);
        return response
    } catch (error) {
        fs.unlinkSync(localFilePath)
        //locally saved file gets deleted
        return null
    }
}

export {uploadOnCloudinary}
