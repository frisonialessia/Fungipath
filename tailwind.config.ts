import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#f1e7db", cream2: "#e8dccd", sand: "#d6c4ac", stone: "#9c9283",
        terracotta: "#a86543", clay: "#8b3f29", umber: "#6d482b", ink: "#2e231b",
        moss: "#0e9b3d", leaf: "#52c871", leaf2: "#85df42",
      },
      fontFamily: { serif: ["Plus Jakarta Sans", "sans-serif"], sans: ["Plus Jakarta Sans", "sans-serif"] },
    },
  },
  plugins: [],
};
export default config;
