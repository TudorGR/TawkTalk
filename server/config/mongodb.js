import mongoose from "mongoose";
import "dotenv/config";

const connectDB = async () => {
  mongoose.connection.on("connected", () => {
    console.log("DB Connected");
  });
  await mongoose.connect(`${process.env.DATABASE_URL}`);
};

export default connectDB;
