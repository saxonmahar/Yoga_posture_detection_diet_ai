# Uploads Directory

This directory stores uploaded files for the Yoga Pose Detection application.

## Structure:
- /images/ - User uploaded yoga pose images
- /processed/ - Processed/optimized images
- /videos/ - Video uploads (future feature)
- /temp/ - Temporary files

## File Naming Convention:
- User images: user_{userId}_pose_{timestamp}.jpg
- Processed images: processed_{originalName}.jpg

## Security Notes:
- Never commit this directory to Git (it's in .gitignore)
- Regular cleanup of old files recommended
- Validate all uploaded files for type and size
