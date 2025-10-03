import type { Config } from "tailwindcss";
import tailwindAnimate from "tailwindcss-animate";

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"], // Source Files
  theme: {
    extend: {},
  },
  plugins: [tailwindAnimate],
};

export default config;
