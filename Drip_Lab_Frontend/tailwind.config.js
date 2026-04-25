/**@type {import('tailwindcss').Config} */

export default {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#000080",
                secondary: "#7DF9FF",
            },
            fontFamily: {
                brand: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}