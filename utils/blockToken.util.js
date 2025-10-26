const { BlockedToken, BlockedAccessToken, BlockedRefreshToken } = require("../models/blockedToken.model");

const blockAccessToken = async (tokenId) => {
    try {
        const blockedToken = new BlockedAccessToken({ tokenId });
        await blockedToken.save();
        console.log(`Access token with ID "${tokenId}" blocked successfully.`);
    } catch (error) {
        console.error("Error blocking access token:", error.message);
    }
}

const blockRefreshToken = async (tokenId) => {
    try {
        const blockedToken = new BlockedRefreshToken({ tokenId });
        await blockedToken.save();
        console.log(`Refresh token with ID "${tokenId}" blocked successfully.`);
    } catch (error) {
        console.error("Error blocking refresh token:", error.message);
    }
}

const isBlacklisted = async (token) => {
    try {
        const blockedToken = await BlockedToken.findOne({ tokenId: token })
        return !!blockedToken
    } catch (error) {
        console.error(error)
        // bubble up the error to caller
        throw error
    }
}

module.exports = {
    blockAccessToken,
    blockRefreshToken,
    isBlacklisted
}