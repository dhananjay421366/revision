import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false }); // refreshToken will be saved in database

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
    avatar: avatar?.url || "",
    coverImage: coverImage?.url || "",
    email,
    password,
    username,
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
  // option for cookies  this option modify only by server no frontend modify
  const option = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, option) // set accessToken as cookie
    .cookie("refreshToken", refreshToken, option) // same as
    .json(
      new ApiResponse(
        200,
        // {
        // user:loggedInUser,accessToken, this commented coode is data when we will sending in utils files ApiResponse
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
    req.user?._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token ");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used ");
    }
    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            refreshToken: newRefreshToken,
          },
          "Access token refreshed sucessfully"
        )
      );
  } catch (error) {
    throw new ApiError(error?.message || "Invalid refresh Token ");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user?._id);
  const idPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!idPasswordCorrect) {
    throw new ApiError(400, "Invalid Old Password");
  }

  user.password = newPassword;
  await user.save({
    validateBeforeSave: false,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed sucessfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(200, req.user, "Current User fetched sucessfully");
});
const updateAccountDetails = asyncHandler(async (req, res) => {
  const { email, fullname } = req.body;
  if (!fullname || !email) {
    throw new ApiError(400, "All fields required");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullname,
        email,
      },
    },
    {
      new: true,
    }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated sucessfully"));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar.url) {
    throw new ApiError(400, "Error while uploading on avatar");
  }
  // Retrieve the current user's avatar URL
  const user = await User.findById(req.user?._id).select("avatar");
  const oldAvatarUrl = user?.avatar;
  const Updateduser = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    {
      new: true,
    }
  ).select("-password");

  // Delete old avatar from Cloudinary
  if (oldAvatarUrl) {
    const oldAvatarPublicId = oldAvatarUrl.split("/").pop().split(".")[0]; // Extract public ID from the URL
    await deleteFromCloudinary(oldAvatarPublicId);
    console.log("old file deleted sucessfully");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, Updateduser, "Avatar image updated sucessfully")
    );
});

const updateUsercoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path;
  if (!coverImageLocalPath) {
    throw new ApiError(400, "Cover Image file is missing ");
  }

  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!coverImage.url) {
    throw new ApiError(400, "Error while uploading on coverImage");
  }
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        coverImage: coverImage.url,
      },
    },
    {
      new: true,
    }
  ).select("-password");
  return res
    .status(200)
    .json(new ApiResponse(200, user, "Cover image updated sucessfully"));
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;

  if (!username?.trim()) {
    throw new ApiError(400, "Username is missing");
  }

  console.log(`Fetching channel profile for username: ${username}`);

  const channel = await User.aggregate([
    {
      $match: {
        username: username.toLowerCase(),
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      $addFields: {
        subscriberCount: { $size: "$subscribers" },
        channelSubscribedToCount: { $size: "$subscribedTo" },
        isSubscribed: {
          $cond: {
            if: { $in: [req.user?._id, "$subscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullname: 1,
        username: 1,
        subscriberCount: 1,
        channelSubscribedToCount: 1,
        isSubscribed: 1,
        avatar: 1,
        coverImage: 1,
        email: 1,
      },
    },
  ]);

  console.log(`Aggregation result: ${JSON.stringify(channel)}`);

  if (!channel || channel.length === 0) {
    throw new ApiError(404, "Channel does not exist");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, channel[0], "User channel fetched successfully")
    );
});


const getWatchHistory = asyncHandler(async (req, res) => {});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUsercoverImage,
  getUserChannelProfile,
  getWatchHistory,
};
