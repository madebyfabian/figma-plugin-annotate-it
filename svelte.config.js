const preprocess = require('svelte-preprocess')
const { babel } = require('./package.json')

module.exports = {
  preprocess: preprocess({ babel })
}