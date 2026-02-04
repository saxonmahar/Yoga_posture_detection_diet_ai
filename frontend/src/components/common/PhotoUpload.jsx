import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Check, User } from 'lucide-react';

function PhotoUpload({ currentPhoto, onPhotoChange, size = 'large', className = '' }) {
  const [preview, setPreview] = useState(currentPhoto || null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-32 h-32',
    xlarge: 'w-40 h-40'
  };

  const handleFileSelect = (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setIsUploading(true);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target.result;
      setPreview(imageUrl);
      setIsUploading(false);
      
      // Call parent callback with file and preview
      if (onPhotoChange) {
        onPhotoChange(file, imageUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const removePhoto = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onPhotoChange) {
      onPhotoChange(null, null);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`relative ${className}`}>
      <div
        className={`
          ${sizeClasses[size]} 
          relative rounded-full overflow-hidden border-4 border-slate-600/50 
          bg-slate-700/50 backdrop-blur-sm cursor-pointer group
          transition-all duration-300 hover:border-slate-500
          ${dragActive ? 'border-emerald-500 bg-emerald-500/10' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />

        {/* Photo preview or placeholder */}
        {preview ? (
          <img
            src={preview}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-600 to-slate-700">
            <User className="w-8 h-8 text-slate-400" />
          </div>
        )}

        {/* Upload overlay */}
        <div className={`
          absolute inset-0 bg-black/60 flex items-center justify-center
          transition-opacity duration-300
          ${preview ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}
        `}>
          {isUploading ? (
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <div className="text-center">
              <Camera className="w-6 h-6 text-white mx-auto mb-1" />
              <p className="text-xs text-white font-medium">
                {preview ? 'Change' : 'Upload'}
              </p>
            </div>
          )}
        </div>

        {/* Remove button */}
        {preview && !isUploading && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              removePhoto();
            }}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        )}
      </div>

      {/* Upload instructions */}
      <div className="mt-3 text-center">
        <p className="text-sm text-slate-400">
          Click to upload or drag & drop
        </p>
        <p className="text-xs text-slate-500 mt-1">
          PNG, JPG up to 5MB
        </p>
      </div>
    </div>
  );
}

export default PhotoUpload;