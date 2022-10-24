/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{svelte,js,ts}"],
  theme: {
    extend: {
      colors: {
        main:'#3450A1',
        mainDarken:'#071D55',
        accent : '#e57dff'
      },
      fontFamily: {
        'mulish': ['Mulish', 'sans-serif'] 
      },
    },
  },
  plugins: [],
};
