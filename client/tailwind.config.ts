import type { Config } from "tailwindcss";
import tailwindAnimate from "tailwindcss-animate";
import tailwindScrollbar from "tailwind-scrollbar"

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"], // Source Files
  theme: {
    extend: {},
  },
  plugins: [tailwindAnimate, tailwindScrollbar],
};

export default config;
