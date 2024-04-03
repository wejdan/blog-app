import React from "react";

const Select = React.forwardRef(
  ({ label, icon, className, options, error, ...props }, ref) => {
    const selectClassName = `bg-gray-800 dark:text-white border ${
      error ? "border-red-500" : "border-gray-600"
    } rounded py-2 px-3 w-full leading-tight focus:outline-none  focus:bg-gray-700 focus:border-gray-500 ${
      icon ? "pl-10" : "pl-3"
    } `;

    return (
      <div className={className}>
        {label && (
          <label className="block text-sm font-bold mb-2 text-gray-400">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
              {icon}
            </span>
          )}
          <select ref={ref} {...props} className={selectClassName}>
            {options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        {error && <p className=" text-xs text-red-500">{error || ""}</p>}
      </div>
    );
  }
);

export default Select;
