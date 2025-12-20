/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#1976d2', // Match MUI default blue
                secondary: '#dc004e',
            }
        },
    },
    corePlugins: {
        preflight: false, // Disable preflight to avoid conflicts with MUI
    },
    plugins: [],
}
