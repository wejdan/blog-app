import React, { useRef } from "react";
import { FaImage, FaSpinner } from "react-icons/fa"; // Import spinner icon for loading indicator

function ImagePicker({
  imagePreview,
  onImageChange,
  id,
  disabled,
  width,
  height,
  error,
  loading,
  rounded, // New prop for rounded corners
}) {
  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    if (!disabled) {
      fileInputRef.current.click();
    }
  };

  // Conditionally apply rounded styles
  const roundedStyle = rounded ? { borderRadius: "50%" } : {};

  return (
    <div className="relative">
      {imagePreview ? (
        <img
          src={imagePreview}
          alt="Image preview"
          onClick={handleImageClick}
          style={{
            width,
            height,
            cursor: disabled ? "not-allowed" : "pointer",
            ...roundedStyle, // Apply rounded style conditionally
          }}
        />
      ) : (
        <div
          style={{
            width,
            height,
            cursor: disabled ? "not-allowed" : "pointer",
            ...roundedStyle, // Apply rounded style conditionally
          }}
          className={`bg-gray-200 flex justify-center items-center`}
          onClick={handleImageClick}
        >
          <FaImage className="text-3xl" />
        </div>
      )}
      {loading && (
        <div
          className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center"
          style={{
            width,
            height,
            ...roundedStyle, // Apply rounded style for loading overlay
          }}
        >
          <FaSpinner className="animate-spin text-white text-4xl" />
        </div>
      )}
      <input
        hidden
        ref={fileInputRef}
        id={id}
        name={id}
        type="file"
        onChange={onImageChange}
        accept=".jpg,.png"
      />
      <p className=" text-xs text-red-500 ">{error || ""}</p>
    </div>
  );
}

export default ImagePicker;
