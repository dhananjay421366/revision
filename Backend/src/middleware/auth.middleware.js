import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";

// this middleware created for check user is logged or not
export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookie?.accessToken ||
      req.header("Authorization")?.replace("Bearer", ""); // get accessToken cookie
    // console.log("token", token);
    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).selsect(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Ïnvalid Access Token");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || " Ïnvalid Access Token");
  }
});
