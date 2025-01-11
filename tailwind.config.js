/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        "rubik-bold": ["Rubik-Bold", "sans-serif"],
        "rubik-extrabold": ["Rubik-ExtraBold", "sans-serif"],
        "rubik-light": ["Rubik-Light", "sans-serif"],
        "rubik-medium": ["Rubik-Medium", "sans-serif"],
        "rubik-regular": ["Rubik-Regular", "sans-serif"],
        "rubik-semibold": ["Rubik-SemiBold", "sans-serif"],
        "spacemono-regular": ["SpaceMono-Regular", "sans-serif"],
      },
      colors: {
        // Primary Colors - Main App UI & Navigation
        primary: {
          50: "#F5F3FF", // Soft Lavender - Background for welcome screen
          100: "#7d56d4", // Purple - Buttons, primary accents
          200: "#D3D3D3", // Light Gray - Button text, form placeholders
          300: "#000000", // Black - Text for headlines, titles
          400: "#E1E1E1", // Light Gray - Background for light sections
          500: "#4B2C7F", // Dark Purple - Active button background, navigation items
          600: "#B73E6D", // Pinkish Red - Interactive items, error state
          700: "#2C6E49", // Forest Green - Trust elements (e.g., verified icons)
          800: "#DAA520", // Goldenrod - Hover and active states for elements like buttons
          900: "#F8D7A4", // Light Gold - Highlight sections, accent borders
          
        },

        // Secondary Colors - Additional Highlights
        secondary: {
          100: "#FBFBFD", // Soft Grayish Blue - Card backgrounds, light UI areas
          200: "#3E3E3E", // Dark Gray - Text, subheadings, less prominent buttons
          300: "#F2F2F2", // Light Gray - Borders, dividers, input backgrounds
        },

        // Alert/Notification Colors
        danger: {
          100: "#F75555", // Red - Error alerts, warnings
          200: "#FFDE5C", // Yellow - Success or information alerts
        },

        // Accent Colors - Decorative & Interactive Items
        accent: {
          100: "#dabdff", // Soft Purple - Hover and active effects for buttons, links
          200: "#FFC300", // Bright Yellow - Call-to-action highlights
        },

        // Dark Mode Elements
        darkMode: {
          100: "#191d31", // Dark Charcoal - Backgrounds for dark mode
          200: "#2C2E3E", // Darker Shade for containers, sidebars
          300: "#7C7C7C", // Gray Text - Secondary text, captions
        },

        // Text Colors
        text: {
          primary: "#494949", // Main text color for paragraphs and body
          secondary: "#7C7C7C", // Secondary text, captions, muted content
          light: "#D3D3D3", // Light text for disabled states
        },

        // Background Colors
        bg: {
          light: "#F8F8F8", // Light background for sections and cards
          dark: "#3E3E3E", // Dark background for sidebars or dark mode
        },
      },
    },
  },
  plugins: [],
};
