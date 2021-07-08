// eslint-disable-next-line @typescript-eslint/no-var-requires
const colors = require('tailwindcss/colors')

module.exports = {
  mode: 'jit',
  purge: {
    content: [
      './public/**/*.html',
      './src/**/*.vue',
      './src/assets/tailwind/safelist.txt',
    ],
  },
  darkMode: false,
  theme: {
    extend: {
      colors: {
        gray: colors.gray,
        cyan: colors.cyan,
        amber: colors.amber,
        orange: colors.orange,
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
        discord: {
          blurple: '#5865f2',
        },
        patreon: {
          'fiery-coral': '#ff424d',
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
