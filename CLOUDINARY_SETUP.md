# Cloudinary Integration Setup

This document explains how to set up Cloudinary for file storage to solve the file persistence issue on Render.

## Problem

When deployed on Render, files stored in the local `uploads/` directory get deleted when the app goes inactive. This causes profile images and chat files to disappear.

## Solution

We've integrated **Cloudinary** - a free cloud storage service that provides:

- ✅ Free tier (no credit card required)
- ✅ Persistent file storage
- ✅ Image optimization and transformation
- ✅ Global CDN for fast file delivery
- ✅ Automatic backup and reliability

## Setup Instructions

### 1. Create a Cloudinary Account

1. Go to [https://cloudinary.com/](https://cloudinary.com/)
2. Sign up for a free account (no credit card required)
3. Verify your email address

### 2. Get Your Cloudinary Credentials

1. Log in to your Cloudinary dashboard
2. On the dashboard, you'll see your credentials:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

### 3. Update Environment Variables

Add the following variables to your `.env` file:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

**For Render deployment:**

1. Go to your Render dashboard
2. Select your web service
3. Go to "Environment" tab
4. Add the three Cloudinary environment variables

### 4. Install Dependencies

The Cloudinary SDK has been added to your dependencies. If you need to install it manually:

```bash
npm install cloudinary
```

## What Changed

### File Storage

- **Before:** Files stored in `uploads/files/` and `uploads/profiles/` directories
- **After:** Files uploaded to Cloudinary cloud storage with URLs like `https://res.cloudinary.com/your-cloud/...`

### Profile Images

- Automatically optimized to 500x500 pixels
- Smart cropping focused on faces
- Stored in `tawktalk/profiles/` folder on Cloudinary

### Chat Files

- Support for all file types (images, videos, documents, etc.)
- Stored in `tawktalk/files/` folder on Cloudinary
- Original filename preserved

### Database Changes

- Added `imagePublicId` field to User model for Cloudinary image management
- File URLs now point to Cloudinary instead of local paths

## Migration (Optional)

If you have existing files you want to migrate to Cloudinary, run:

```bash
node scripts/migrateToCloudinary.js
```

This will:

1. Upload existing profile images to Cloudinary
2. Upload existing chat files to Cloudinary
3. Update database records with new URLs

## Benefits

1. **Persistence:** Files never get deleted when app goes inactive
2. **Performance:** Fast global CDN delivery
3. **Optimization:** Automatic image optimization and resizing
4. **Reliability:** 99.9% uptime with automatic backups
5. **Free:** Generous free tier suitable for most applications

## File Limits (Free Tier)

- **Storage:** 25GB
- **Bandwidth:** 25GB/month
- **Transformations:** 25,000/month
- **Image/Video processing:** Included

This is more than enough for most chat applications.

## Security

- Files are served over HTTPS
- Access can be controlled via Cloudinary settings
- Automatic malware scanning included
- Private/public access control available

## Testing

After setup, test by:

1. Uploading a profile image
2. Sending a file in chat
3. Verify files are accessible via the Cloudinary URLs
4. Check your Cloudinary dashboard to see uploaded files

## Troubleshooting

### Common Issues:

1. **"Invalid API credentials"**

   - Double-check your environment variables
   - Ensure no extra spaces in the values
   - Verify credentials in Cloudinary dashboard

2. **"Upload failed"**

   - Check your internet connection
   - Verify Cloudinary service status
   - Check file size limits

3. **Files not showing**
   - Clear browser cache
   - Check if URLs are correctly formed
   - Verify files exist in Cloudinary dashboard

### Environment Variables

Make sure all three Cloudinary variables are set:

```bash
echo $CLOUDINARY_CLOUD_NAME
echo $CLOUDINARY_API_KEY
echo $CLOUDINARY_API_SECRET
```

## Support

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Cloudinary Support](https://support.cloudinary.com/)
- Free tier includes email support
