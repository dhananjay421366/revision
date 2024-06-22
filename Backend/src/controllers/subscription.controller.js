import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    const userId = req.user._id;

    if (!channelId) {
        throw new ApiError(400, "Channel ID is missing");
    }

    // Check if the user is already subscribed to the channel
    const existingSubscription = await Subscription.findOne({
        channel: channelId,
        subscriber: userId,
    });

    if (existingSubscription) {
        // Unsubscribe the user if they are already subscribed
        await Subscription.deleteOne({ _id: existingSubscription._id });
        return res
            .status(200)
            .json(new ApiResponse(200, null, "Unsubscribed from the channel successfully"));
    } else {
        // Subscribe the user to the channel if not already subscribed
        const newSubscription = new Subscription({
            channel: channelId,
            subscriber: userId,
        });
        await newSubscription.save();
        return res
            .status(200)
            .json(new ApiResponse(200, newSubscription, "Subscribed to the channel successfully"));
    }
});


// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}