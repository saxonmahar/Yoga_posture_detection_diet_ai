const API_BASE_URL = 'http://localhost:5010'; // Dedicated photo server

class PhotoService {
  // Upload profile photo
  async uploadProfilePhoto(file) {
    try {
      const formData = new FormData();
      formData.append('profilePhoto', file);

      console.log('Uploading to:', `${API_BASE_URL}/api/photo/upload`);

      const response = await fetch(`${API_BASE_URL}/api/photo/upload`, {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      // Get the raw response text first
      const responseText = await response.text();
      console.log('Raw response:', responseText);

      // Try to parse as JSON
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.error('Response was:', responseText.substring(0, 500));
        throw new Error(`Server returned HTML instead of JSON. Status: ${response.status}`);
      }
      
      if (!response.ok) {
        throw new Error(result.message || 'Upload failed');
      }

      return result;
    } catch (error) {
      console.error('Photo upload error:', error);
      throw error;
    }
  }

  // Delete profile photo
  async deleteProfilePhoto() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/photo/delete`, {
        method: 'DELETE',
        credentials: 'include'
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Delete failed');
      }

      return result;
    } catch (error) {
      console.error('Photo delete error:', error);
      throw error;
    }
  }

  // Get user profile with photo
  async getUserProfile() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/photo/profile`, {
        method: 'GET',
        credentials: 'include'
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to get profile');
      }

      return result;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }

  // Get photo URL (handles both relative and absolute URLs)
  getPhotoUrl(photoPath) {
    if (!photoPath) return null;
    
    // If it's already a full URL, return as is
    if (photoPath.startsWith('http')) {
      return photoPath;
    }
    
    // Use the photo server (port 5010) for serving photos
    return `http://localhost:5010${photoPath}`;
  }

  // Validate image file
  validateImageFile(file) {
    const errors = [];
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      errors.push('File must be an image');
    }
    
    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      errors.push('File size must be less than 5MB');
    }
    
    // Check file format
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      errors.push('File must be JPEG, PNG, GIF, or WebP format');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Create image preview
  createImagePreview(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        resolve(e.target.result);
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsDataURL(file);
    });
  }

  // Resize image (optional - for optimization)
  async resizeImage(file, maxWidth = 800, maxHeight = 800, quality = 0.8) {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
        
        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(resolve, file.type, quality);
      };
      
      img.src = URL.createObjectURL(file);
    });
  }
}

export default new PhotoService();