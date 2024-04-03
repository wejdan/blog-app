import React from "react";

const TextArea = React.forwardRef(
  ({ label, icon, className, inputStyles, error, ...props }, ref) => {
    const baseClass =
      "w-full px-4 py-2   bg-gray-700 text-white rounded-md focus:border-pink-500 focus:outline-none";
    return (
      <textarea ref={ref} {...props} className={`${baseClass} ${className}`} />
    );
  }
);

export default TextArea;
