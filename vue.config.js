// vue.config.js
module.exports = {
    chainWebpack: config => {
      config.plugin('define').tap( ([options = {}]) => {
        return [{
          ...options, // these are the env variables from your .env file, if any arr defined
          VUE_APP_VERSION: JSON.stringify(require('./package.json').version)
        }]
      })
    }
  }