// tailwind.config.js
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",   // Tailwind will scan all your React components here
    "./public/index.html",          // Optional: for any inline classes in HTML
  ],
  theme: {
    extend: {},
  },
  plugins: [],
});
