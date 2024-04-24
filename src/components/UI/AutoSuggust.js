import React, { useCallback } from "react";
import Select, { components } from "react-select";
import makeAnimated from "react-select/animated";
import AsyncSelect from "react-select/async";
import { useSelector } from "react-redux";
import { searchUsers } from "../../services/user";
const animatedComponents = makeAnimated();

const getCustomStyles = (isDarkMode) => ({
  control: (base, state) => ({
    ...base,
    background: isDarkMode ? "#1F2937" : "#FFFFFF",
    borderColor: state.isFocused
      ? "#9CA3AF"
      : isDarkMode
      ? "#4B5563"
      : "#9ca3af",
    color: isDarkMode ? "white" : "black",
    boxShadow: "none",
    "&:hover": {
      borderColor: isDarkMode ? "#9CA3AF" : "#D1D5DB",
    },
  }),
  menu: (base) => ({
    ...base,
    background: isDarkMode ? "#1F2937" : "#FFFFFF",
    marginTop: "2px",
    borderRadius: "0 0 4px 4px",
  }),
  option: (base, state) => ({
    ...base,
    background: state.isFocused
      ? isDarkMode
        ? "#374151"
        : "#EEEEEE"
      : isDarkMode
      ? "#1F2937"
      : "#FFFFFF",
    color: isDarkMode ? "#D1D5DB" : "black",
    "&:active": {
      background: isDarkMode ? "#4B5563" : "#DDDDDD",
    },
  }),
  singleValue: (base) => ({
    ...base,
    color: isDarkMode ? "white" : "black",
  }),
  placeholder: (base) => ({
    ...base,
    color: isDarkMode ? "#9CA3AF" : "#A1A1AA",
  }),
  valueContainer: (base) => ({
    ...base,
    padding: "0 8px",
  }),
  input: (base) => ({
    ...base,
    color: isDarkMode ? "white" : "black",
    margin: 0,
    padding: 0,
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  dropdownIndicator: (base) => ({
    ...base,
    color: isDarkMode ? "white" : "black",
  }),
  clearIndicator: (base) => ({
    ...base,
    color: isDarkMode ? "white" : "black",
  }),
});

// Add more customized styles as needed

const CustomOption = (props) => {
  const { Option } = components;
  return (
    <Option {...props}>
      <div className="flex items-center">
        <img
          src={props.data.image}
          alt={props.data.label}
          className="w-10 h-10 rounded-full mr-2" // Tailwind classes
        />
        {props.data.label}
      </div>
    </Option>
  );
};

const Autocomplete = React.forwardRef(
  (
    { options, className, isMulti, placeholder, exclude, label, ...props },
    ref
  ) => {
    const isDarkMode = useSelector((state) => state.appSettings.isDarkMode);

    const loadOptions = async (inputValue) => {
      try {
        const options = await searchUsers(inputValue);
        // If `exclude` array is provided and not null, filter out the excluded options
        console.log("options", options);
        if (exclude && exclude.length > 0) {
          return options.filter((option) => !exclude.includes(option.value));
        }
        return options;
      } catch (error) {
        console.error("Error fetching data:", error);
        return [];
      }
    };
    return (
      <div className={className}>
        {label && (
          <label className="block text-sm font-bold mb-2 text-gray-900 dark:text-gray-400">
            {label}
          </label>
        )}
        <AsyncSelect
          cacheOptions
          defaultOptions
          loadOptions={loadOptions}
          styles={getCustomStyles(isDarkMode)}
          isMulti={isMulti}
          components={{
            ...animatedComponents,
            Option: CustomOption,
          }}
          classNamePrefix="react-select"
          {...props}
        />{" "}
      </div>
    );
  }
);
export default Autocomplete;
{
  /* <AsyncSelect
          cacheOptions
          defaultOptions
          loadOptions={loadOptions}
          styles={customStyles}
          components={{
            ...animatedComponents,
            Option: CustomOption,
          }}
          classNamePrefix="react-select"
          {...props}
        /> */
}
