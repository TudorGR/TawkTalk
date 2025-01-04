import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/AuthRoutes.js";
import contactsRoutes from "./routes/ContactRoutes.js";
import messagesRoutes from "./routes/MessagesRoutes.js";
import channelRoutes from "./routes/ChannelRoutes.js";
import setupSocket from "./socket.js";
import connectDB from "./config/mongodb.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
connectDB();

app.use(express.json());
app.use(cors());

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactsRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/channel", channelRoutes);

app.get("/", (req, res) => {
  res.send("API Working");
});

const server = app.listen(port, () =>
  console.log("server started on port : " + port)
);
setupSocket(server);

// const startServer = async () => {
//   try {
//     await mongoose.connect(`${databaseURL}`);
//     console.log("DB connection Successful");

//     app.use(
//       cors({
//         origin: [process.env.ORIGIN, "https://tawk-talk-server.vercel.app"],
//         credentials: true,
//       })
//     );
//     app.use(express.json());
//     app.use(cookieParser());

//     // app.use("/uploads/profiles", express.static("uploads/profiles"));
//     // app.use("/uploads/files", express.static("uploads/files"));

//     app.use("/api/auth", authRoutes);
//     app.use("/api/contacts", contactsRoutes);
//     app.use("/api/messages", messagesRoutes);
//     app.use("/api/channel", channelRoutes);

//     app.get("/", (req, res) => {
//       res.send("API Working");
//     });

//     const server = app.listen(port, () => {
//       console.log(`Server is running at http://localhost:${port}`);
//     });

//     setupSocket(server);
//   } catch (error) {
//     console.error("Error connecting to MongoDB:", error.message);
//     process.exit(1);
//   }
// };

// startServer();

// export default app;
