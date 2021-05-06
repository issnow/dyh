const path = require('path');
module.exports = {
  configureWebpack: {
    plugins: [
      // new MyAwesomeWebpackPlugin()
    ],
    mode: 'development',
    module: {
      rules: [

      ]
    },
    devServer: {
      overlay: false,
      proxy: {
        '/api': {
          target: 'http://localhost:3004',
          pathRewrite: {
            '^/api': ''
          }
        }
      }
    },
    resolve: {
      alias: {
        '$component': path.resolve(__dirname, 'src/components'),
        '$view': path.resolve(__dirname, 'src/views'),
        $css: path.resolve(__dirname, 'src/css'),
        '@api': path.resolve(__dirname, 'src/api')
      },
      extensions: ['.js', '.vue']
    }
  }
}