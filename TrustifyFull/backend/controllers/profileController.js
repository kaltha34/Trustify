const User = require("../models/userModel");

// Upload Profile Picture
exports.uploadProfilePicture = async (req, res) => {
    try {
        console.log("User data from token:", req.user); // Debugging

        // Ensure user ID is available
        const userId = req.user.id || req.user.userId;  

        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        // Store profile picture data
        const profilePicture = {
            filename: req.file.originalname,
            contentType: req.file.mimetype,
            imageData: req.file.buffer, // Works with memory storage
        };

        // Update user profile with new picture
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePicture },
            { new: true, runValidators: true } 
        );

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({
            message: "Profile picture updated successfully",
            user: updatedUser
        });

    } catch (error) {
        console.error("Error uploading profile picture:", error);
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
};

// Retrieve Profile Picture
exports.getProfilePicture = async (req, res) => {
    try {
        const userId = req.user.id || req.user.userId;
        const user = await User.findById(userId);

        if (!user || !user.profilePicture) {
            return res.status(404).json({ error: "Profile picture not found" });
        }

        // Send image data
        res.set("Content-Type", user.profilePicture.contentType);
        res.send(user.profilePicture.imageData);

    } catch (error) {
        console.error("Error retrieving profile picture:", error);
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
};
