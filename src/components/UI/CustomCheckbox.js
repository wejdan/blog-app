import React from "react";

const CustomCheckbox = ({ checked, onChange }) => {
  return (
    <div
      className={`w-6 h-6 flex items-center justify-center ${
        checked ? "bg-blue-500" : "bg-gray-700"
      } rounded-md cursor-pointer`}
      onClick={() => onChange(!checked)}
    >
      {checked && (
        <svg
          className="w-4 h-4 text-white"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M5 13l4 4L19 7"></path>
        </svg>
      )}
    </div>
  );
};

// Usage within ImageGrid component
export default CustomCheckbox;
