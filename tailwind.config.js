module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      opacity: ["responsive", "hover", "focus", "group-hover"],
      translate: ["responsive", "hover", "focus", "group-hover"],
      scale: ["responsive", "hover", "focus", "group-hover"],
      transform: ["responsive", "hover", "focus", "group-hover"],
      transitionProperty: ["responsive", "hover", "focus"],
    },
  },
  plugins: [],
};
