const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
    filename: String,
    contentType: String,
    imageData: Buffer,
}, { timestamps: true });

module.exports = mongoose.model("Image", imageSchema);
