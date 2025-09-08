import cloudinary from "./config/cloudinary.js";
import User from "./models/UserModel.js";
import MessageModel from "./models/MessagesModel.js";
import { existsSync } from "fs";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Migration script to move existing files to Cloudinary
async function migrateFilesToCloudinary() {
  try {
    console.log("Starting migration to Cloudinary...");

    // Connect to database
    await mongoose.connect(`${process.env.DATABASE_URL}/chat-app`);
    console.log("Connected to database");

    // Migrate profile images
    console.log("Migrating profile images...");
    const users = await User.find({ image: { $exists: true, $ne: null } });

    for (const user of users) {
      if (user.image && user.image.startsWith("uploads/profiles/")) {
        const localPath = path.join(process.cwd(), user.image);

        if (existsSync(localPath)) {
          try {
            const result = await cloudinary.uploader.upload(localPath, {
              folder: "tawktalk/profiles",
              width: 500,
              height: 500,
              crop: "fill",
              gravity: "face",
              use_filename: true,
              unique_filename: true,
            });

            await User.findByIdAndUpdate(user._id, {
              image: result.secure_url,
              imagePublicId: result.public_id,
            });

            console.log(`✓ Migrated profile image for user ${user.email}`);
          } catch (error) {
            console.log(
              `✗ Failed to migrate profile image for user ${user.email}:`,
              error.message
            );
          }
        }
      }
    }

    // Migrate message files
    console.log("Migrating message files...");
    const messages = await MessageModel.find({
      messageType: "file",
      fileUrl: { $exists: true, $ne: null },
    });

    for (const message of messages) {
      if (message.fileUrl && message.fileUrl.startsWith("uploads/files/")) {
        const localPath = path.join(process.cwd(), message.fileUrl);

        if (existsSync(localPath)) {
          try {
            const result = await cloudinary.uploader.upload(localPath, {
              folder: "tawktalk/files",
              resource_type: "auto",
              use_filename: true,
              unique_filename: true,
            });

            await MessageModel.findByIdAndUpdate(message._id, {
              fileUrl: result.secure_url,
            });

            console.log(`✓ Migrated file for message ${message._id}`);
          } catch (error) {
            console.log(
              `✗ Failed to migrate file for message ${message._id}:`,
              error.message
            );
          }
        }
      }
    }

    console.log("Migration completed!");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

// Run migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateFilesToCloudinary();
}

export default migrateFilesToCloudinary;
