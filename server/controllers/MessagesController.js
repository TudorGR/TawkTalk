import MessageModel from "../models/MessagesModel.js";
import cloudinary from "../config/cloudinary.js";
import { unlinkSync } from "fs";

export const getMessages = async (req, res, next) => {
  try {
    const user1 = req.userId;
    const user2 = req.body.id;

    if (!user1 || !user2) {
      return res.status(400).send("both users ID's are required");
    }

    const messages = await MessageModel.find({
      $or: [
        { sender: user1, recipient: user2 },
        { sender: user2, recipient: user1 },
      ],
    }).sort({ timestamp: 1 });

    return res.status(200).json({ messages });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};

export const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).send("file is required");
    }

    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "tawktalk/files",
      resource_type: "auto", // Automatically detects file type (image, video, etc.)
      use_filename: true,
      unique_filename: true,
    });

    // Delete the temporary file
    unlinkSync(req.file.path);

    return res.status(200).json({
      filePath: result.secure_url,
      publicId: result.public_id,
      originalName: req.file.originalname,
      fileSize: result.bytes,
      fileType: result.resource_type,
    });
  } catch (error) {
    console.log(error);

    // Clean up temp file if it exists
    if (req.file && req.file.path) {
      try {
        unlinkSync(req.file.path);
      } catch (cleanupError) {
        console.log("Error cleaning up temp file:", cleanupError);
      }
    }

    return res.status(500).send("Internal Server Error");
  }
};
