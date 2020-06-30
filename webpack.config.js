const path = require('path'),
      fs = require('fs'),
      manifest = require('./src/manifest.json'),
      svelteConfig = require('./svelte.config')

const HtmlWebpackPlugin = require('html-webpack-plugin'),
      HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin'),
      WebpackMessages = require('webpack-messages'),
      MiniCssExtractPlugin = require('mini-css-extract-plugin'),
      { CleanWebpackPlugin } = require('clean-webpack-plugin')  

module.exports = ( env, argv ) => {
  const mode          = argv.mode || 'development'
  const isProduction  = mode === 'production'

  return {
    mode,
  
    // This is necessary because Figma's 'eval' works differently than normal eval
    devtool: isProduction ? false : 'inline-source-map',
    
    entry: {
      main: './src/code.ts',
      bundle: [ './src/svelte.main.js' ]
    },
  
    resolve: {
      alias: {
        svelte: path.resolve('node_modules', 'svelte')
      },
      extensions: [ '.js', '.mjs', '.ts', '.svelte', '.scss', '.html' ],
      mainFields: [ 'svelte', 'browser', 'module', 'main' ]
    },
    
    output: {
      path: path.join(__dirname, 'build'),
      filename: '[name].js'
    },
  
    module: {
      rules: [
        // Svelte
        {
          test: /\.svelte$/,
          use: {
            loader: 'svelte-loader',
            options: {
              ...svelteConfig, 
              emitCss: true,
              hotReload: true
            }
          }
        },
        
        // JS and TS
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: [
            'babel-loader',
          ]
        },
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: [
            'babel-loader',
            'ts-loader'
          ]
        },

        // CSS and SCSS
        {
          test: /\.s?css$/,
          use: [
            /**
             * MiniCssExtractPlugin doesn't support HMR.
             * For developing, use 'style-loader' instead.
             * */
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
            'sass-loader'
          ]
        }
      ]
    },
  
    plugins: [
      new CleanWebpackPlugin(), // Clean /build before every build

      new MiniCssExtractPlugin({
        filename: '[name].css'
      }),
  
      new HtmlWebpackPlugin({
        filename: 'ui.html',
        templateContent: '<!doctype html><html lang="en"><head><meta charset="utf-8"></head><body></body></html>',
        inlineSource: '.(js|css)$',
        chunks: [ 'bundle' ],
      }),
  
      new HtmlWebpackInlineSourcePlugin(),
  
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

            // Remove build/bundle.js & build/bundle.css (because it is already included inside ui.html)
            const bundlePath = './build/bundle.js'
            if (fs.existsSync(bundlePath))
                fs.unlinkSync(bundlePath)

            const bundleCSSPath = './build/bundle.css'
            if (isProduction && fs.existsSync(bundleCSSPath))
              fs.unlinkSync(bundleCSSPath)
          });
        }
      },
    ],  
  
    stats: false
  }
}