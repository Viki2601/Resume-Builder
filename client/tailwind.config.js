/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customColor: '#ebc9bb',
        customColor1: '#FFF4EC',
        customColor2: '#E8CFC1',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        slideUp: 'slideUp 1.5s ease-out',
      },
    },
    fontFamily: {
      'sans': ['BR Firma', 'sans-serif'],
      'serif': ['ui-serif', 'Georgia'],
      'mono': ['ui-monospace', 'SFMono-Regular'],
      'display': ['Oswald'],
      'body': ['Open Sans'],
      'cursive': ['Playwrite FR Moderne', 'cursive'],
      'heading': ['Merriweather', 'serif'],
      'nunito': ['nunito', 'sans-serif'],
      'raleway': ['Raleway', 'sans-serif'],
      'montserrat': ['Montserrat', 'sans-serif'],
      'tenorSans': ['Tenor Sans', 'sans-serif'],
    },
  },
  plugins: [],
}