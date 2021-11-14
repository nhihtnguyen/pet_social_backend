import cloudinary from "../utils/cloudinary.js";
import fs from "fs";

export const uploadSingle = (file_path, folder_name) => {
    return new Promise(resolve => {
        cloudinary.uploader.upload(file_path, {
                folder: folder_name
            })
            .then(result => {
                if (result) {
                     fs.unlinkSync(file_path);
                    resolve({
                        url: result.secure_url
                    })
                }
            })
    })}
