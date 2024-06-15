import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
const registerUser = asyncHandler(async (req, res) => {
  // Algorithm for Register user
  // get user details from frontend
  // check validation   - non empty
  // check if user already exists  :username, email
  // check for images ,check for avatar
  // upload them to cloudinary,avatar
  // create user object - create entry in db
  // remove password and refresh token field from res
  //check for user creation
  // return res

  // get user details from frontend
  const { fullname, username, email, password } = req.body;
  console.log("email", email);

  // check validation   - non empty

  if (
    [fullname, username, email, password].some(
      (fields) => fields?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // check if user already exists  :username, email
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "User has been already exists");
  }

  // req.files
  console.log(req.files);
  // check for images ,check for avatar
  const avatarLocalPath = req.files?.avatar[0]?.path;
  // check for images ,check for coverImage
  const coverImagePath = req.files?.avatar[0]?.path;

  // check validation  for avatarlocalPath
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file are required");
  }
  // check validation  for coverimageLocalPath
  if (!coverImagePath) {
    throw new ApiError(400, "coverImage file are required");
  }
  // upload them to cloudinary,avatar
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImagePath);

  // check validation files are uploaded on cloudinary or not
  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  if (!coverImage) {
    throw new ApiError(400, "coverImage file is required");
  }

  // create user object - create entry in db
  const user = await User.create({
    fullname,
    username: username.toLowerCase(),
    email,
    password,
    avatar: avatar.url,
    coverImage: coverImage.url,
  });
  // remove password and refresh token field from res

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // check for user creation
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  // return res
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User register sucessfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  //get user details from frontend : req.body
  // check validation
  // check user exist or not
  // check password
});
export { registerUser };
