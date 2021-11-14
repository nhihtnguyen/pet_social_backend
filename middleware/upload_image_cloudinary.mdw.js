import { uploadSingle } from '../services/cloudinary_service.js';

export const uploadImageCloudinaryMiddleware = async(req, res, next) => {
    try {
        console.log('---', req.file)
   const result = await uploadSingle(req.file.path, 'post_images');
   res.media_URL = result.url;
   } catch(err) {
       res.json({message: err.message})
   }
   next();
}
