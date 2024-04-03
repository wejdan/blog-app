import React from "react";

const Avatar = React.forwardRef(({ imageUrl, size = "8" }, ref) => {
  const sizeClasses = {
    8: "w-8 h-8",
    16: "w-16 h-16",
    5: "w-5 h-5",
    32: "w-32 h-32",
    // Add more sizes as needed
  };

  // Default size class if the provided size doesn't match the predefined ones
  const sizeClass = sizeClasses[size] || sizeClasses["8"];

  return (
    <div
      ref={ref}
      className={`${sizeClass} rounded-full cursor-pointer overflow-hidden`}
    >
      <img src={imageUrl} alt="Avatar" className="object-cover w-full h-full" />
    </div>
  );
});

export default Avatar;
