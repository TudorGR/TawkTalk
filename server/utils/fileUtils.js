import { mkdirSync, existsSync } from "fs";
import path from "path";

// Ensure temp directory exists
export const ensureTempDir = () => {
  const tempDir = path.join(process.cwd(), "temp");
  if (!existsSync(tempDir)) {
    mkdirSync(tempDir, { recursive: true });
    console.log("Created temp directory for file uploads");
  }
};

// Initialize directories on server start
export const initializeDirectories = () => {
  ensureTempDir();
};
