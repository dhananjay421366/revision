import { v2 as cloudinary } from "cloudinary";
import fs from "fs"; // file system

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      return null;
    }

    // upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // file has been uploaded successfully
    console.log("File is uploaded on cloudinary", response.url);
    // delete the local file if it exists
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove the localy saved temporary file as the upload operation got faield

    return null;
  }
};

const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) {
      return null;
    }

    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Error while deleting old avatar from Cloudinary", error);
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
