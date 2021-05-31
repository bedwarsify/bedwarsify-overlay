// eslint-disable-next-line @typescript-eslint/no-var-requires
const colors = require('tailwindcss/colors')

module.exports = {
  purge: {
    content: ['./public/**/*.html', './src/**/*.vue'],
    options: {
      safelist: [
        'text-minecraft-dark-red',
        'text-minecraft-red',
        'text-minecraft-gold',
        'text-minecraft-yellow',
        'text-minecraft-dark-green',
        'text-minecraft-green',
        'text-minecraft-aqua',
        'text-minecraft-dark-aqua',
        'text-minecraft-dark-blue',
        'text-minecraft-blue',
        'text-minecraft-light-purple',
        'text-minecraft-dark-purple',
        'text-minecraft-white',
        'text-minecraft-gray',
        'text-minecraft-dark-gray',
        'text-minecraft-black',
      ],
    },
  },
  darkMode: false,
  theme: {
    extend: {
      colors: {
        gray: colors.gray,
        minecraft: {
          'dark-red': '#aa0000',
          red: '#ff5555',
          gold: '#ffaa00',
          yellow: '#ffff55',
          'dark-green': '#00aa00',
          green: '#55ff55',
          aqua: '#55ffff',
          'dark-aqua': '#00aaaa',
          'dark-blue': '#0000aa',
          blue: '#5555ff',
          'light-purple': '#ff55ff',
          'dark-purple': '#aa00aa',
          white: '#ffffff',
          gray: '#aaaaaa',
          'dark-gray': '#555555',
          black: '#000000',
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
