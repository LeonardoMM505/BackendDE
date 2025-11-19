import {v2 as cloudinary} from 'cloudinary';
import dotenv from 'dotenv';
import {CloudinaryStorage} from 'multer-storage-cloudinary';
import multer from 'multer';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'disco-elysium/portadas', // Nombre de la carpeta en Cloudinary
        allowed_formats: ['jpeg', 'png', 'jpg'], // Solo permitimos imágenes
        transformation: [{ width: 500, height: 500, crop: 'limit' }] // Opcional: redimensionar
    },
});

export const upload = multer({ storage: storage });

export default cloudinary;