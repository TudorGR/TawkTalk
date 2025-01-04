import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/AuthRoutes.js";
import contactsRoutes from "./routes/ContactRoutes.js";
import messagesRoutes from "./routes/MessagesRoutes.js";
import channelRoutes from "./routes/ChannelRoutes.js";
import setupSocket from "./socket.js";

dotenv.config();
const databaseURL = process.env.DATABASE_URL;

mongoose
  .connect(databaseURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connection Successful");

    const app = express();
    const port = process.env.PORT || 4000;

    app.use(
      cors({
        origin: [process.env.ORIGIN, "https://tawk-talk-server.vercel.app"],
        credentials: true,
      })
    );
    app.use(express.json());
    app.use(cookieParser());

    // app.use("/uploads/profiles", express.static("uploads/profiles"));
    // app.use("/uploads/files", express.static("uploads/files"));

    app.use("/api/auth", authRoutes);
    app.use("/api/contacts", contactsRoutes);
    app.use("/api/messages", messagesRoutes);
    app.use("/api/channel", channelRoutes);

    app.get("/", (req, res) => {
      res.send("API Working");
    });

    const server = app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });

    setupSocket(server);
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });
