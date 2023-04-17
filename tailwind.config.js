const focusColor = "#487a99";
const focusDarkColor = "#39617a"; // lighter #406d89
const breakColor = "#e69a38";
const breakDarkColor = "#b87b2c"; // lighter #cf8a32
const primary = "#f2e6d8";
const primaryDark = "#d9cfc2"; //lighter #d9cfc2, darker #c1b8ac
const secondary = "#80363d";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        //https://lospec.com/palette-list/bitbybit
        focus: focusColor,
        break: breakColor,
        primary,
        "primary-dark": primaryDark,
        secondary,
      },
      textColor: {
        focus: focusColor,
        "focus-dark": focusDarkColor,
        break: breakColor,
        "break-dark": breakDarkColor,
        primary: primary,
        "primary-dark": primaryDark,
        secondary: secondary,
      },
    },
  },
  plugins: [],
};
