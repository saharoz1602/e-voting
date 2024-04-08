/** @type {import('tailwindcss')).Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      keyframes: {
        "content-show": {
          from: { left: "-24rem" },
          to: { left: 0 },
        },

        "content-hide": {
          to: { left: "-24rem" },
          from: { left: 0 },
        },
      },

      animation: {
        "content-show": "content-show 250ms  ease-in-out",
        "content-hide": "content-hide 250ms  ease-in-out",
      },
    },
  },
  plugins: [],
};
