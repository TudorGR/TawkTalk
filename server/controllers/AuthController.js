import { compare } from "bcrypt";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinary.js";
import { unlinkSync } from "fs";

const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_KEY, {
    expiresIn: maxAge,
  });
};

export const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send("Email and password is required");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("Email already exists");
    }

    const user = await User.create({ email, password });
    res.cookie("jwt", createToken(email, user.id), {
      maxAge,
      secure: true,
      sameSite: "None",
    });
    return res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send("Email and password is required");
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send("User with this email doesn't exist");
    }
    const auth = await compare(password, user.password);
    if (!auth) {
      return res.status(400).send("Password incorrect");
    }
    res.cookie("jwt", createToken(email, user.id), {
      maxAge,
      secure: true,
      sameSite: "None",
    });
    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        color: user.color,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};

export const getUserInfo = async (req, res, next) => {
  try {
    const userData = await User.findById(req.userId);
    if (!userData) {
      return res.status(400).send("User with this id doesn't exist");
    }

    return res.status(200).json({
      id: userData.id,
      email: userData.email,
      profileSetup: userData.profileSetup,
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.image,
      color: userData.color,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { userId } = req;
    const { firstName, lastName, color } = req.body;

    if (!firstName || !lastName) {
      return res.status(400).send("firstName, lastName, color is required");
    }

    const userData = await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        color,
        profileSetup: true,
      },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      id: userData.id,
      email: userData.email,
      profileSetup: userData.profileSetup,
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.image,
      color: userData.color,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};

export const addProfileImage = async (req, res, next) => {
  try {
    console.log("=== Profile Image Upload Debug ===");
    console.log("File received:", req.file ? "Yes" : "No");

    if (!req.file) {
      console.log("No file in request");
      return res.status(400).send("File is required");
    }

    console.log("File details:", {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
    });

    console.log("Cloudinary config check:", {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? "Set" : "Missing",
      api_key: process.env.CLOUDINARY_API_KEY ? "Set" : "Missing",
      api_secret: process.env.CLOUDINARY_API_SECRET ? "Set" : "Missing",
    });

    // Upload profile image to Cloudinary
    console.log("Starting Cloudinary upload...");
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "tawktalk/profiles",
      width: 500,
      height: 500,
      crop: "fill",
      gravity: "face",
      use_filename: true,
      unique_filename: true,
    });

    console.log("Cloudinary upload result:", {
      secure_url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
    });

    // Delete the temporary file
    unlinkSync(req.file.path);
    console.log("Temporary file deleted");

    console.log("Updating user with ID:", req.userId);
    const userData = await User.findByIdAndUpdate(
      req.userId,
      {
        image: result.secure_url,
        imagePublicId: result.public_id, // Store public_id for deletion
      },
      { new: true, runValidators: true }
    );

    console.log("User updated, new image URL:", userData.image);

    return res.status(200).json({
      image: userData.image,
    });
  } catch (error) {
    console.log("=== Profile Image Upload Error ===");
    console.log("Error details:", error);

    // Clean up temp file if it exists
    if (req.file && req.file.path) {
      try {
        unlinkSync(req.file.path);
        console.log("Cleaned up temp file after error");
      } catch (cleanupError) {
        console.log("Error cleaning up temp file:", cleanupError);
      }
    }

    return res.status(500).send("Internal Server Error");
  }
};

export const removeProfileImage = async (req, res, next) => {
  try {
    const { userId } = req;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send("User not found");
    }

    // Delete image from Cloudinary if it exists
    if (user.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(user.imagePublicId);
      } catch (cloudinaryError) {
        console.log("Error deleting from Cloudinary:", cloudinaryError);
      }
    }

    // Update user in database
    user.image = null;
    user.imagePublicId = null;
    await user.save();

    return res.status(200).send("Profile image removed");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};

export const logOut = async (req, res, next) => {
  try {
    res.cookie("jwt", "", { maxAge: 1, secure: true, sameSite: "None" });

    return res.status(200).send("Logout successful");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};
