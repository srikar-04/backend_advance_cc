import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import fs from 'fs/promises';
import path from 'path';

// Environment validation
const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error('Cloudinary configuration missing. Please check your environment variables.');
}

// Configure Cloudinary
cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
});

console.log("Cloudinary configured successfully");

// Types
interface UploadResult {
    success: true;
    data: UploadApiResponse;
}

interface UploadError {
    success: false;
    error: string;
}

type UploadResponse = UploadResult | UploadError;

// Helper function to safely delete local file
const deleteLocalFile = async (filePath: string): Promise<void> => {
    try {
        await fs.unlink(filePath);
        console.log('Local file deleted successfully:', filePath);
    } catch (error) {
        console.error('Failed to delete local file:', filePath, error);
        // Don't throw - this is cleanup, not critical
    }
};

// Main upload function
const uploadOnCloudinary = async (localFilePath: string): Promise<UploadResponse> => {
    // Validate input
    if (!localFilePath || typeof localFilePath !== 'string') {
        return {
            success: false,
            error: 'Invalid file path provided'
        };
    }

    // Check if file exists
    try {
        await fs.access(localFilePath);
    } catch (error) {
        return {
            success: false,
            error: `File does not exist: ${localFilePath}`
        };
    }

    try {
        // Upload to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });

        console.log('File uploaded successfully:', response.url);
        
        // Clean up local file after successful upload
        await deleteLocalFile(localFilePath);
        
        return {
            success: true,
            data: response
        };

    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        
        // Clean up local file even on error
        await deleteLocalFile(localFilePath);
        
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown upload error'
        };
    }
};

export { uploadOnCloudinary };