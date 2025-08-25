import { ProfileImageUploadProps } from "@/interfaces/auth.interface";
import { useState, useRef } from "react";

export function ProfileImageUpload({ 
  setProfileImageUrl, 
  currentImage = null,
  size = 150 
}: ProfileImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(currentImage);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "trip-finder-avatars");

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: "POST", body: formData }
    );

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return data.secure_url;
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5MB");
      return;
    }

    setError(null);
    setUploading(true);

    // Create preview URL immediately
    const previewUrl = URL.createObjectURL(file);
    setPreviewImage(previewUrl);

    try {
      // Auto-upload the image
      const uploadedUrl = await uploadImage(file);
      
      // Replace preview with uploaded URL
      setPreviewImage(uploadedUrl);
      setProfileImageUrl?.(uploadedUrl);
      
      console.log("Image uploaded successfully:", uploadedUrl);
    } catch (error) {
      setError("Failed to upload image. Please try again.");
      setPreviewImage(currentImage);
      setProfileImageUrl?.(null);
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
      // Clean up the preview URL to prevent memory leaks
      URL.revokeObjectURL(previewUrl);
    }
  };

  const handleCircleClick = () => {
    if (!uploading) {
      fileInputRef.current?.click();
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    setError(null);
    setProfileImageUrl?.(null);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Circular Image Preview */}
      <div 
        className={`relative cursor-pointer group ${uploading ? 'cursor-not-allowed' : ''}`}
        style={{ width: size, height: size }}
        onClick={handleCircleClick}
      >
        <div 
          className={`w-full h-full rounded-full border-4 border-gray-300 overflow-hidden bg-gray-100 hover:border-blue-400 transition-colors duration-200 ${
            uploading ? 'opacity-50' : ''
          }`}
          style={{ width: size, height: size }}
        >
          {previewImage ? (
            <img 
              src={previewImage} 
              alt="Profile preview" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg 
                className="w-12 h-12" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
          )}
        </div>
        
        {/* Overlay on hover - only show if not uploading */}
        {!uploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <svg 
              className="w-8 h-8 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        )}
        
        {/* Loading spinner */}
        {uploading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 rounded-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />

      {/* Remove image button - only show if image exists and not uploading */}
      {/* {previewImage && !uploading && (
        <button
          onClick={handleRemoveImage}
          className="text-red-600 hover:text-red-800 text-sm transition-colors duration-200"
        >
          Remove Image
        </button>
      )} */}

      {/* Status messages */}
      {uploading && (
        <p className="text-blue-600 text-sm">Uploading image...</p>
      )}
      
      {error && (
        <p className="text-red-600 text-sm text-center">{error}</p>
      )}

      {/* Instructions */}
      {!previewImage && !uploading && (
        <p className="text-gray-500 text-sm text-center">
          Click the circle to upload your profile picture
        </p>
      )}
    </div>
  );
}