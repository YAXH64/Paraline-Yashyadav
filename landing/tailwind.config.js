/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        midnight: "#050816",
        steel: "#7f92b0",
        mist: "#d8e1f2",
        glow: "#7dd3fc",
        mint: "#6ee7b7",
      },
      fontFamily: {
        display: ['"Syne"', "sans-serif"],
        sans: ['"Plus Jakarta Sans"', "sans-serif"],
      },
      boxShadow: {
        aura: "0 0 0 1px rgba(255,255,255,0.06), 0 20px 80px rgba(41, 121, 255, 0.18)",
        soft: "0 12px 40px rgba(4, 10, 28, 0.45)",
      },
      backgroundImage: {
        noise:
          "radial-gradient(circle at top, rgba(125,211,252,0.14), transparent 32%), radial-gradient(circle at 20% 20%, rgba(167,139,250,0.12), transparent 28%), radial-gradient(circle at 80% 0%, rgba(110,231,183,0.1), transparent 22%)",
      },
    },
  },
  plugins: [],
};
