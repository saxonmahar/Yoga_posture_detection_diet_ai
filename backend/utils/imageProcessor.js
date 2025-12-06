const sharp = require('sharp');
const fs = require('fs');

class ImageProcessor {
  async processImage(imagePath) {
    try {
      // Resize and optimize image
      const processedPath = imagePath.replace(/(\.\w+)$/, '_processed$1');
      
      await sharp(imagePath)
        .resize(800, 600, { fit: 'inside' })
        .jpeg({ quality: 80 })
        .toFile(processedPath);
      
      return processedPath;
    } catch (error) {
      console.error('Image processing error:', error);
      return imagePath; // Return original if processing fails
    }
  }

  async extractBase64(imagePath) {
    try {
      const imageBuffer = await sharp(imagePath)
        .resize(640, 480)
        .jpeg({ quality: 70 })
        .toBuffer();
      
      return imageBuffer.toString('base64');
    } catch (error) {
      throw new Error(`Failed to process image: ${error.message}`);
    }
  }

  async validateImage(imagePath) {
    try {
      const metadata = await sharp(imagePath).metadata();
      return {
        valid: true,
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        size: fs.statSync(imagePath).size
      };
    } catch (error) {
      return {
        valid: false,
        error: error.message
      };
    }
  }
}

module.exports = new ImageProcessor();