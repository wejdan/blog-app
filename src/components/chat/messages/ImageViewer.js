import React, { useState } from "react";

function ImageViewer({ imageUrl, onClose }) {
  if (!imageUrl) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
    >
      <button
        className="absolute top-4 right-4 text-white text-2xl"
        onClick={onClose}
      >
        &times;
      </button>
      <img src={imageUrl} alt="Full Size" className="max-h-full max-w-full" />
    </div>
  );
}
export default ImageViewer;
