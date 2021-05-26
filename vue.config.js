/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
module.exports = {
  pluginOptions: {
    /**
     * @type {}
     */
    electronBuilder: {
      preload: './src/preload.ts',
      outputDir: './dist',
      builderOptions: {
        appId: 'com.bedwarsify.overlay',
        productName: 'Bedwarsify Overlay',
        mac: {
          category: 'public.app-category.games',
        },
        linux: {
          category: 'Game',
        },
      },
    },
    apollo: {
      lintGQL: true,
    },
  },
}
