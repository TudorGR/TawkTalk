import cloudinary from "./config/cloudinary.js";
import dotenv from "dotenv";

dotenv.config();

// Test Cloudinary configuration
async function testCloudinaryConfig() {
  console.log("=== Cloudinary Configuration Test ===");

  console.log("Environment Variables:");
  console.log(
    "CLOUDINARY_CLOUD_NAME:",
    process.env.CLOUDINARY_CLOUD_NAME ? "Set" : "Missing"
  );
  console.log(
    "CLOUDINARY_API_KEY:",
    process.env.CLOUDINARY_API_KEY ? "Set" : "Missing"
  );
  console.log(
    "CLOUDINARY_API_SECRET:",
    process.env.CLOUDINARY_API_SECRET ? "Set" : "Missing"
  );

  try {
    // Test connection by getting account details
    const result = await cloudinary.api.ping();
    console.log("✅ Cloudinary connection successful:", result);
  } catch (error) {
    console.log("❌ Cloudinary connection failed:", error.message);

    if (error.message.includes("Invalid cloud_name")) {
      console.log("📝 Check your CLOUDINARY_CLOUD_NAME");
    }
    if (error.message.includes("Invalid API key")) {
      console.log("📝 Check your CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET");
    }
  }
}

testCloudinaryConfig();
