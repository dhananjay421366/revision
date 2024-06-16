import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wront while generating refresh and access token"
    );
  }
};

// const registerUser = asyncHandler(async (req, res) => {
//   // Algorithm for Register user
//   // get user details from frontend
//   // check validation   - non empty
//   // check if user already exists  :username, email
//   // check for images ,check for avatar
//   // upload them to cloudinary,avatar
//   // create user object - create entry in db
//   // remove password and refresh token field from res
//   //check for user creation
//   // return res

//   // get user details from frontend
//   const { fullname, username, email, password } = req.body;
//   console.log("email", email);

//   // check validation   - non empty

//   if (
//     [fullname, username, email, password].some(
//       (fields) => fields?.trim() === ""
//     )
//   ) {
//     throw new ApiError(400, "All fields are required");
//   }

//   // check if user already exists  :username, email
//   const existedUser = await User.findOne({
//     $or: [{ username }, { email }],
//   });
//   if (existedUser) {
//     throw new ApiError(409, "User has been already exists");
//   }

//   // req.files
//   console.log(req.files);
//   // check for images ,check for avatar
//   const avatarLocalPath = req.files?.avatar[0]?.path;
//   // check for images ,check for coverImage
//   const coverImagePath = req.files?.avatar[0]?.path;

//   // another way to get path of coverImagePath
//   // let coverImage;
//   // if (
//   //   req.files &&
//   //   Array.isArray(req.files.coverImage) &&
//   //   req.files.coverImage.length > 0
//   // ) {
//   //   coverImagePath = req.files?.avatar[0]?.path;
//   // }

//   // check validation  for avatarlocalPath
//   if (!avatarLocalPath) {
//     throw new ApiError(400, "Avatar file are required");
//   }
//   // check validation  for coverimageLocalPath
//   if (!coverImagePath) {
//     throw new ApiError(400, "coverImage file are required");
//   }
//   // upload them to cloudinary,avatar
//   const avatar = await uploadOnCloudinary(avatarLocalPath);
//   const coverImage = await uploadOnCloudinary(coverImagePath);

//   // check validation files are uploaded on cloudinary or not
//   if (!avatar) {
//     throw new ApiError(400, "Avatar file is required");
//   }

//   if (!coverImage) {
//     throw new ApiError(400, "coverImage file is required");
//   }

//   // create user object - create entry in db
//   const user = await User.create({
//     fullname,
//     username: username.toLowerCase(),
//     email,
//     password,
//     avatar: avatar.url,
//     coverImage: coverImage.url,
//   });
//   // remove password and refresh token field from res

//   const createdUser = await User.findById(user._id).select(
//     "-password -refreshToken"
//   );

//   // check for user creation
//   if (!createdUser) {
//     throw new ApiError(500, "Something went wrong while registering the user");
//   }

//   // return res
//   return res
//     .status(201)
//     .json(new ApiResponse(200, createdUser, "User register sucessfully"));
// });
const registerUser = asyncHandler(async (req, res) => {
  // steps
  // get user details from frontend
  // validation  - non empty
  //  check if user is already exists - username ,email
  //  check for images check  for avatar
  // upload them cludinary
  // create user object - create entry in db
  // remove password refresh tocken fields from response
  // chech for user creation
  // return response

  // get user details from frontend
  const { fullname, email, username, password } = req.body;
  console.log("email: ", email);

  // validation
  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }
  //  check if user is already exists - username ,email
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "User  with email or username already exists");
  }
   console.log(req.files);

  //  check for images check  for avatar
  const avatarLocalPath = req.files?.avatar[0]?.path; // getting file avatar
  console.log(avatarLocalPath);
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  // let coverImageLocalPath;
  // if (
  //   req.files &&
  //   Array.isArray(req.files.coverImage) &&
  //   req.files.coverImage.length > 0
  // ) {
  //   coverImageLocalPath = req.files.coverImage[0].path;
  // }

  console.log(coverImageLocalPath);

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }
  if (!coverImageLocalPath) {
    throw new ApiError(400, "coverImage file is required");
  }

  // upload them cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar  file is required");
  }
  if (!coverImage) {
    throw new ApiError(400, "coverImage  file is required");
  }

  // create user object - create entry in db
  const user = await User.create({
    fullname,
    avatar: avatar?.url  || "",
    coverImage: coverImage?.url || "",
    email,
    password,
    username
  });

  // remove password refresh tocken fields from response
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // check for user creation
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  // return response
  return res
    .status(201)
    .json(new ApiResponse("200", createdUser, "User registered successfully"));
});
const loginUser = asyncHandler(async (req, res) => {
  //get user details from frontend : req.body
  // check validation  : username and  email
  // check user exist or not
  // check password
  // access and refresh token  generate
  // sent cookie
  // return  res

  //get user details from frontend : req.body
  const { username, email, password } = req.body;

  // check validation  : username and email
  if (!username && !email) {
    throw new ApiError(400, "username or password is required");
  }

  // check user exist or not
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  // check password
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid User credentials");
  }
  // access and refresh token generation
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  // sent cookie

  const option = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, option) // set accessToken
    .cookie("refreshToken", refreshToken, option) // same as
    .json(
      new ApiResponse(
        200,
        // {
        // user:loggedInUser,accessToken, this commented coode is data when we will sending in utils files
        // refreshToken
        // },
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In Successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );
  const option = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", option)
    .clearCookie("refreshToken", option)
    .json(new ApiResponse(200, {}, "User logged Out"));
});
export { registerUser, loginUser, logoutUser };
