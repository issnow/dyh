const path = require('path');
module.exports = {
  // publicPath: '/m/',
  // outputDir: path.resolve(__dirname, 'dist/m'),
  // configureWebpack: {
  //   plugins: [
  //     // new MyAwesomeWebpackPlugin()
  //   ],
  //   mode: 'development',
  //   module: {
  //     rules: [

  //     ]
  //   },
  //   devServer: {
  //     overlay: false,
  //     proxy: {
  //       '/api': {
  //         target: 'http://localhost:3004',
  //         pathRewrite: {
  //           '^/api': ''
  //         }
  //       }
  //     }
  //   },
  //   resolve: {
  //     alias: {
  //       '@component': path.resolve(__dirname, 'src/components'),
  //       '@view': path.resolve(__dirname, 'src/views'),
  //       @css: path.resolve(__dirname, 'src/css'),
  //       '@api': path.resolve(__dirname, 'src/api')
  //     },
  //     extensions: ['.js', '.vue']
  //   }
  // }
  configureWebpack: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@component': path.resolve(__dirname, 'src/components'),
      '@view': path.resolve(__dirname, 'src/views'),
      '@css': path.resolve(__dirname, 'src/css'),
      '@api': path.resolve(__dirname, 'src/api')
    }
    if (process.env.NODE_ENV === 'production') {
      // 为生产环境修改配置...
    } else {
      // 为开发环境修改配置...
      console.log('+++', config);
      config.devServer = {
        overlay: false,
        proxy: {
          '/api': {
            target: 'http://123.60.24.237:8085',
            pathRewrite: {
              '^/api': ''
            }
          }
        }
      }
    }
    
  }
}