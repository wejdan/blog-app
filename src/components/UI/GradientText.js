import React from "react";

function GradientText({ children, className }) {
  return (
    <h1
      className={`text-4xl font-bold rounded-md px-1  text-white inline  bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 ${className}`}
    >
      {children}
    </h1>
  );
}

export default GradientText;
