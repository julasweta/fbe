
import React from "react";

interface ImageUploadProps {
  onUpload: (url: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onUpload }) => {
  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "FBEimg");

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/divhalkcr/image/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) {
        onUpload(data.secure_url);
      } else {
        console.error("Upload failed:", data);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return <input type="file" accept="image/*" onChange={handleUpload} />;
};

export default ImageUpload;

