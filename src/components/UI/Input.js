import React from "react";

const Input = React.forwardRef(
  ({ label, icon, className, inputStyles, error, ...props }, ref) => {
    const baseClass =
      "w-full px-4 py-2   bg-gray-700 text-white rounded-md focus:border-pink-500 focus:outline-none";
    return (
      <input ref={ref} {...props} className={`${baseClass} ${className}`} />
    );
  }
);

export default Input;
