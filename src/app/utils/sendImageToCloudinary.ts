import { v2 as cloudinary } from "cloudinary";
import config from "../config";
import multer from "multer";
import fs from "fs";

// Configuration
cloudinary.config({
    cloud_name: config.cloudinary_cloud_name as string,
    api_key: config.cloudinary_api_key as string,
    api_secret: config.cloudinary_api_secret as string, // Click 'View API Keys' above to copy your API secret
});

export const sendImageToCloudinary = async (
    path: string,
    imageName: string,
) => {
    // Upload an image
    const uploadResult = await cloudinary.uploader
        .upload(path, {
            public_id: imageName,
        })
        .catch((error) => {
            console.log(error);
        });

    // Optimize delivery by resizing and applying auto-format and auto-quality
    // const optimizeUrl = cloudinary.url(imageName, {
    //     fetch_format: "auto",
    //     quality: "auto",
    // });

    // Transform the image: auto-crop to square aspect_ratio
    // const autoCropUrl = cloudinary.url(imageName, {
    //     crop: "auto",
    //     gravity: "auto",
    //     width: 500,
    //     height: 500,
    // });

    //remove file from local
    fs.unlink(path, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log("File is deleted");
        }
    });

    return uploadResult;
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.cwd() + "/uploads/");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        cb(null, file.originalname + "-" + uniqueSuffix);
    },
});

export const upload = multer({ storage: storage });
