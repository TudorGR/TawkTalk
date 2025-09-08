import { HOST } from "@/utils/constants";

/**
 * Helper function to get the correct image URL
 * Handles both legacy local images and new Cloudinary URLs
 * @param {string} imageUrl - The image URL from the database
 * @returns {string} - The correct full URL to display the image
 */
export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return null;

  // If it's already a full URL (Cloudinary), return as is
  if (imageUrl.startsWith("http")) {
    return imageUrl;
  }

  // Legacy local file - construct with HOST
  return `${HOST}/${imageUrl}`;
};
