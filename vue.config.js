// eslint-disable-next-line @typescript-eslint/no-var-requires
process.env.VUE_APP_VERSION = require('./package.json').version

/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
module.exports = {
  pluginOptions: {
    electronBuilder: {
      preload: './src/preload.ts',
      outputDir: './dist',
      builderOptions: {
        appId: 'com.bedwarsify.overlay',
        productName: 'Bedwarsify Overlay',
        win: {
          target: ['nsis', 'appx'],
        },
        mac: {
          target: ['default'],
          category: 'public.app-category.games',
        },
        linux: {
          target: ['AppImage', 'snap'],
          category: 'Game',
        },
        appx: {
          applicationId: process.env.APPX_APPLICATION_ID,
          identityName: process.env.APPX_IDENTITY_NAME,
          publisher: process.env.APPX_PUBLISHER,
          publisherDisplayName: process.env.APPX_PUBLISHER_DISPLAY_NAME,
        },
      },
    },
    apollo: {
      lintGQL: true,
    },
  },
}
