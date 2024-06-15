import connectDB from "./db/index.js";
import dotenv from "dotenv";
import { app } from "./app.js";

dotenv.config({
  path: "./.env",
});
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, (req, res) => {
      console.log(` Server is running on PORT :${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error("Faild to  connecting to MongoDB", error);
    throw error;
  });

{
  /*

()(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    app.on("error", (error) => {
      console.error("Error", error);
      throw err;
    });

    app.listen(process.env.PORT, (req, res) => {
      console.log(`App  is listening on PORT :${process.env.PORT}`);
    });
  } catch (error) {
    console.error("Error", error);
    throw err;
  }
})();
*/
}

// if (
//   [fullname, username, email, password].some(
//     (fields) => fields?.trim() === ""
//   )
// ) {
//   throw new ApiError(400, "All fields are required");
// }

// // check user are already exists :username , email
// const existUser = await User.findOne({
//   $or: [{ username }, { email }],
// });

// // check exist user
// if (existUser) {
//   throw new ApiError(409, "User  with email or username already exists");
// }

// // check for images ,check for avatar

// // first check req.files
// console.log(req.files);
// const avatarLocalPath = req.files?.avatar[0]?.path;
// const coverImageLocalPath = req.files?.coverImage[0]?.path;
// // check for images ,check for avatar
// if (!avatarLocalPath) {
//   throw new ApiError(400, "Avatar file is required");
// }
// // check for images ,check for coverImage
// if (!coverImageLocalPath) {
//   throw new ApiError(400, "coverImage file is required");
// }

// // upload them to cloudinary,avatar
// const avatar = await uploadOnCloudinary(avatarLocalPath);
// const coverImage = await uploadOnCloudinary(coverImageLocalPath);

// // check validation

// if (!avatar) {
//   throw new ApiError(400, "Avatar  file is required");
// }
// if (!coverImage) {
//   throw new ApiError(400, "coverImage file is required");
// }

// // create user object - create entry in db
// const user = await User.create({
//   fullname,
//   username,
//   email,
//   password,
//   avatar: avatar?.url,
//   coverImage: coverImage?.url,
// });

// // remove password and refresh token field from res
// const createdUser = await User.findById(user._id).select(
//   "-password -refreshTocken"
// );

// if (!createdUser) {
//   throw new ApiError(500, "Something went wrong while registering the user");
// }

// return res
//   .status(201)
//   .json(new ApiResponse("200",createdUser, "User  has been created successfully"));
// });
