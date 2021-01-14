const webpack = require('webpack')
module.exports = {
    configureWebpack: {
        plugins: [
            new webpack.IgnorePlugin(/^config\/abi\//),
            new webpack.IgnorePlugin(/^config\/server\//),
            new webpack.IgnorePlugin(/^server\//),
            new webpack.IgnorePlugin(/^tests\//),
            new webpack.IgnorePlugin(/^contracts\//),
        ]
    }
  }