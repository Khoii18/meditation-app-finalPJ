import { v2 as cloudinary } from 'cloudinary';

export const generateSignature = (req, res) => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });

    const timestamp = Math.round((new Date).getTime() / 1000);

    const folder = "meditation-app-packages";
    const resource_type = "auto";

    const signature = cloudinary.utils.api_sign_request({
      timestamp: timestamp,
      folder: folder,
    }, process.env.CLOUDINARY_API_SECRET);

    res.json({ 
      timestamp, 
      signature, 
      folder,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
