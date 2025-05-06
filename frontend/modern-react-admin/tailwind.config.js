/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1677ff",
          light: "#e6f4ff",
          dark: "#0958d9",
        },
        success: {
          DEFAULT: "#52c41a",
          light: "#f6ffed",
          dark: "#389e0d",
        },
        warning: {
          DEFAULT: "#faad14",
          light: "#fffbe6",
          dark: "#d48806",
        },
        error: {
          DEFAULT: "#ff4d4f",
          light: "#fff2f0",
          dark: "#cf1322",
        },
      },
    },
  },
  plugins: [],
  // 确保不影响Ant Design的样式
  corePlugins: {
    preflight: false,
  },
} 