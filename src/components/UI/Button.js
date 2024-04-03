import React from "react";
import Loader from "./Loader";

const Button = ({
  children,
  className,
  variant,
  isLoading,
  isDisabled,
  ...props
}) => {
  const baseStyles =
    "font-semibold py-2 px-4 rounded inline-flex items-center justify-center";
  const solidStyles = "bg-gradient-to-r from-pink-500 to-purple-500 text-white";
  const outlineStyles = "button-outline-gradient";
  const glowStyles = "button-glow";
  const disabledStyles = "bg-gray-500 text-gray-300 cursor-not-allowed";
  const loadingStyles = "relative";
  const baseClass = `${baseStyles} ${
    variant === "solid" && !isDisabled
      ? solidStyles
      : variant === "outline"
      ? `${outlineStyles} ${glowStyles}`
      : ""
  } ${isDisabled || isLoading ? disabledStyles : ""} ${
    isLoading ? loadingStyles : ""
  } ${className}`;
  return (
    <button
      {...props}
      className={`${baseClass} ${className}`}
      disabled={isDisabled || isLoading}
    >
      <span className="flex items-center justify-center">
        {children}
        {isLoading && <Loader size={"16"} className={"ml-2"} />}
      </span>
    </button>
  );
};

export default Button;
