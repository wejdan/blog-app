import React from "react";

const Loader = ({ size = 32, className }) => {
  const circleStyle = {
    width: `${size}px`,
    height: `${size}px`,
    borderWidth: "2px",
    borderColor: "currentColor",
    borderTopColor: "transparent",
    borderRadius: "9999px",
    animation: "spin 1s linear infinite",
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div style={circleStyle}></div>
    </div>
  );
};

export default Loader;
