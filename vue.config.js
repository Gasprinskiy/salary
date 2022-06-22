module.exports = {
  publicPath:  '',
  outputDir: 'docs',
  filenameHashing: false,
  productionSourceMap: false,
  pluginOptions: {
    cordovaPath: 'src-cordova'
  },
  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import "./src/styles/variables.scss";`
      }
    }
  },
}
