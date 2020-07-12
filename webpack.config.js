const path = require('path'),
      manifest = require('./src/manifest.json'),
      fs = require('fs')

const HtmlWebpackPlugin = require('html-webpack-plugin'),
      HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin'),
      WebpackMessages = require('webpack-messages'),
      VueLoaderPlugin = require('vue-loader/lib/plugin')

console.clear()

module.exports = ( env, argv ) => {
  const mode          = argv.mode || 'development'
  const isProduction  = mode === 'production'

  return {
    mode,
  
    // This is necessary because Figma's 'eval' works differently than normal eval
    devtool: isProduction ? false : 'inline-source-map',

    stats: false,

    performance: {
      hints: false
    },
    
    entry: {
      main: './src/main.ts',
      ui: './src/ui.ts'
    },

    output: {
      filename: '[name].js',
      path: path.join(__dirname, 'build'),
    },  
    
    module: {
      rules: [
        // Converts Vue code to JavaScript
        { test: /\.vue$/, loader: 'vue-loader' }, // , exclude: /node_modules/
  
        // Converts TypeScript code to JavaScript
        { test: /\.tsx?$/, use: 'ts-loader', exclude: /node_modules/ },
  
        // Enables including CSS by doing "import './file.css'" in your TypeScript code
        { test: /\.css$/, loader: [{ loader: 'style-loader' }, { loader: 'css-loader' }] },
  
        // Allows you to use "<%= require('./file.svg') %>" in your HTML code to get a data URI
        { test: /\.(png|jpg|gif|webp)$/, loader: [{ loader: 'url-loader' }] },

        { test: /\.svg$/, loader: 'svg-inline-loader' },
  
        { test: /\.scss$/, use: [ 'vue-style-loader', 'css-loader', { loader: 'sass-loader', options: { prependData: `@import "src/scss/_config.scss";` } } ] }
      ],
    },

    resolveLoader: {
      modules: [path.join(__dirname, 'node_modules')]
    },

    resolve: {
      // Webpack tries these extensions for you if you omit the extension like "import './file'"
      extensions: ['.tsx', '.ts', '.jsx', '.js', '.vue', '.json'],
      alias: {
        'vue$': 'vue/dist/vue.esm.js',
        '@': path.resolve(__dirname, 'src/')
      }
    },

    plugins: [
      new HtmlWebpackPlugin({
        template: './src/ui.html',
        filename: 'ui.html',
        inlineSource: '.(js)$',
        chunks: ['ui'],
      }),

      new HtmlWebpackInlineSourcePlugin(),
      new VueLoaderPlugin(),
      new WebpackMessages(),

      {
        apply: (compiler) => {
          compiler.hooks.afterEmit.tap('AfterEmitPlugin', compilation => {
            
            // Create build/manifest.json
            fs.writeFileSync('./build/manifest.json', JSON.stringify({
              ...manifest,
              main: 'main.js',
              ui: 'ui.html',
              name: `${ isProduction ? '🚀 PROD' : '⚙️ DEV'} — ${ manifest.name || 'Please provide plugin name' }`,
              id: manifest.id || ''
            }))

            // Remove build/ui.js &(because it is already included inside ui.html)
            const bundlePath = './build/ui.js'
            if (fs.existsSync(bundlePath))
                fs.unlinkSync(bundlePath)
          })
        }
      },
    ]
  }
}