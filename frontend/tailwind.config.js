/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#0a0a0a',
                surface: '#121212',
                surfaceHighlight: '#1e1e1e',
                primary: '#00f0ff', // Cyber Blue
                secondary: '#ff003c', // Cyber Red
                accent: '#39ff14', // Cyber Green
                text: '#eaeaea',
                muted: '#a0a0a0'
            },
            fontFamily: {
                mono: ['Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
                sans: ['Inter', 'system-ui', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
