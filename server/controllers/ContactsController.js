import User from "../models/userModel.js";

export const searchContacts = async (req, res, next) => {
  try {
    const { search } = req.body;

    if (search === undefined || search === null) {
      return res.status(400).send("Search term is required");
    }

    const sanitizedSearchTerm = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const regex = new RegExp(sanitizedSearchTerm, "i");
    const contacts = await User.find({
      $and: [
        { _id: { $ne: req.userId } },
        { $or: [{ firstName: regex }, { lastName: regex }, { email: regex }] },
      ],
    });

    return res.status(200).json({ contacts });

    return res.status(200).send("Logout successful");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};
