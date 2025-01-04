import { compare } from "bcrypt";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
// import { unlinkSync } from "fs";

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
    const user = await User.create({ email, password });
    res.cookie("jwt", createToken(email, user.id), {
      maxAge,
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

export const lol = async (req, res, next) => {
  try {
    return res.status(201).json({
      message: "hello",
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

    // const auth = await compare(password, user.password);
    // if (!auth) {
    //   return res.status(400).send("Password incorrect");
    // }

    // res.cookie("jwt", createToken(email, user.id), {
    //   maxAge,
    // });

    // return res.status(200).json({
    //   user: {
    //     id: user.id,
    //     email: user.email,
    //     profileSetup: user.profileSetup,
    //     firstName: user.firstName,
    //     lastName: user.lastName,
    //     image: user.image,
    //     color: user.color,
    //   },
    // });

    return res.status(201).json({
      message: "hello",
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

// Comment out the function that handles file uploads
// export const addProfileImage = async (req, res, next) => {
//   try {
//     if (!req.file) {
//       return res.status(400).send("File is required");
//     }
//     // File upload logic here
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send("Internal Server Error");
//   }
// };

// Comment out the function that handles file deletions
// export const removeProfileImage = async (req, res, next) => {
//   try {
//     const { userId } = req;
//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).send("User not found");
//     }

//     if (user.image) {
//       unlinkSync(user.image);
//     }

//     user.image = null;
//     await user.save();

//     return res.status(200).send("Profile image removed");
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send("Internal Server Error");
//   }
// };

export const logOut = async (req, res, next) => {
  try {
    res.cookie("jwt", "", { maxAge: 1 });

    return res.status(200).send("Logout successful");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};
