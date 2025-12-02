import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
    "../demos/**/*.{ts,tsx}",
    "../src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        "demo-bg": "rgb(9 9 11)",
        "demo-panel": "rgb(24 24 27)"
      }
    }
  },
  plugins: []
};

export default config;
