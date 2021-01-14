{
  mode: 'production',
  context: 'C:\\Share\\home\\sl-vue',
  devtool: 'source-map',
  node: {
    setImmediate: false,
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  },
  output: {
    path: 'C:\\Share\\home\\sl-vue\\dist',
    filename: 'js/[name].[contenthash:8].js',
    publicPath: '/',
    chunkFilename: 'js/[name].[contenthash:8].js'
  },
  resolve: {
    alias: {
      '@': 'C:\\Share\\home\\sl-vue\\src',
      vue$: 'vue/dist/vue.runtime.esm.js'
    },
    extensions: [
      '.mjs',
      '.js',
      '.jsx',
      '.vue',
      '.json',
      '.wasm'
    ],
    modules: [
      'node_modules',
      'C:\\Share\\home\\sl-vue\\node_modules',
      'C:\\Share\\home\\sl-vue\\node_modules\\@vue\\cli-service\\node_modules'
    ]
  },
  resolveLoader: {
    modules: [
      'C:\\Share\\home\\sl-vue\\node_modules\\@vue\\cli-plugin-eslint\\node_modules',
      'C:\\Share\\home\\sl-vue\\node_modules\\@vue\\cli-plugin-babel\\node_modules',
      'node_modules',
      'C:\\Share\\home\\sl-vue\\node_modules',
      'C:\\Share\\home\\sl-vue\\node_modules\\@vue\\cli-service\\node_modules'
    ]
  },
  module: {
    noParse: /^(vue|vue-router|vuex|vuex-router-sync)$/,
    rules: [
      /* config.module.rule('vue') */
      {
        test: /\.vue$/,
        use: [
          {
            loader: 'cache-loader',
            options: {
              cacheDirectory: 'C:\\Share\\home\\sl-vue\\node_modules\\.cache\\vue-loader',
              cacheIdentifier: '69a6ee42'
            }
          },
          {
            loader: 'vue-loader',
            options: {
              compilerOptions: {
                preserveWhitespace: false
              },
              cacheDirectory: 'C:\\Share\\home\\sl-vue\\node_modules\\.cache\\vue-loader',
              cacheIdentifier: '69a6ee42'
            }
          }
        ]
      },
      /* config.module.rule('images') */
      {
        test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 4096,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'img/[name].[hash:8].[ext]'
                }
              }
            }
          }
        ]
      },
      /* config.module.rule('svg') */
      {
        test: /\.(svg)(\?.*)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'img/[name].[hash:8].[ext]'
            }
          }
        ]
      },
      /* config.module.rule('media') */
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 4096,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'media/[name].[hash:8].[ext]'
                }
              }
            }
          }
        ]
      },
      /* config.module.rule('fonts') */
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 4096,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'fonts/[name].[hash:8].[ext]'
                }
              }
            }
          }
        ]
      },
      /* config.module.rule('pug') */
      {
        test: /\.pug$/,
        oneOf: [
          /* config.module.rule('pug').oneOf('pug-vue') */
          {
            resourceQuery: /vue/,
            use: [
              {
                loader: 'pug-plain-loader'
              }
            ]
          },
          /* config.module.rule('pug').oneOf('pug-template') */
          {
            use: [
              {
                loader: 'raw-loader'
              },
              {
                loader: 'pug-plain-loader'
              }
            ]
          }
        ]
      },
      /* config.module.rule('css') */
      {
        test: /\.css$/,
        oneOf: [
          /* config.module.rule('css').oneOf('vue-modules') */
          {
            resourceQuery: /module/,
            use: [
              {
                loader: 'C:\\Share\\home\\sl-vue\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  hmr: false,
                  publicPath: '../'
                }
              },
              {
                loader: 'css-loader',
                options: {
                  sourceMap: false,
                  importLoaders: 2,
                  modules: true,
                  localIdentName: '[name]_[local]_[hash:base64:5]'
                }
              },
              {
                loader: 'postcss-loader',
                options: {
                  sourceMap: false
                }
              }
            ]
          },
          /* config.module.rule('css').oneOf('vue') */
          {
            resourceQuery: /\?vue/,
            use: [
              {
                loader: 'C:\\Share\\home\\sl-vue\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  hmr: false,
                  publicPath: '../'
                }
              },
              {
                loader: 'css-loader',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              {
                loader: 'postcss-loader',
                options: {
                  sourceMap: false
                }
              }
            ]
          },
          /* config.module.rule('css').oneOf('normal-modules') */
          {
            test: /\.module\.\w+$/,
            use: [
              {
                loader: 'C:\\Share\\home\\sl-vue\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  hmr: false,
                  publicPath: '../'
                }
              },
              {
                loader: 'css-loader',
                options: {
                  sourceMap: false,
                  importLoaders: 2,
                  modules: true,
                  localIdentName: '[name]_[local]_[hash:base64:5]'
                }
              },
              {
                loader: 'postcss-loader',
                options: {
                  sourceMap: false
                }
              }
            ]
          },
          /* config.module.rule('css').oneOf('normal') */
          {
            use: [
              {
                loader: 'C:\\Share\\home\\sl-vue\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  hmr: false,
                  publicPath: '../'
                }
              },
              {
                loader: 'css-loader',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              {
                loader: 'postcss-loader',
                options: {
                  sourceMap: false
                }
              }
            ]
          }
        ]
      },
      /* config.module.rule('postcss') */
      {
        test: /\.p(ost)?css$/,
        oneOf: [
          /* config.module.rule('postcss').oneOf('vue-modules') */
          {
            resourceQuery: /module/,
            use: [
              {
                loader: 'C:\\Share\\home\\sl-vue\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  hmr: false,
                  publicPath: '../'
                }
              },
              {
                loader: 'css-loader',
                options: {
                  sourceMap: false,
                  importLoaders: 2,
                  modules: true,
                  localIdentName: '[name]_[local]_[hash:base64:5]'
                }
              },
              {
                loader: 'postcss-loader',
                options: {
                  sourceMap: false
                }
              }
            ]
          },
          /* config.module.rule('postcss').oneOf('vue') */
          {
            resourceQuery: /\?vue/,
            use: [
              {
                loader: 'C:\\Share\\home\\sl-vue\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  hmr: false,
                  publicPath: '../'
                }
              },
              {
                loader: 'css-loader',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              {
                loader: 'postcss-loader',
                options: {
                  sourceMap: false
                }
              }
            ]
          },
          /* config.module.rule('postcss').oneOf('normal-modules') */
          {
            test: /\.module\.\w+$/,
            use: [
              {
                loader: 'C:\\Share\\home\\sl-vue\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  hmr: false,
                  publicPath: '../'
                }
              },
              {
                loader: 'css-loader',
                options: {
                  sourceMap: false,
                  importLoaders: 2,
                  modules: true,
                  localIdentName: '[name]_[local]_[hash:base64:5]'
                }
              },
              {
                loader: 'postcss-loader',
                options: {
                  sourceMap: false
                }
              }
            ]
          },
          /* config.module.rule('postcss').oneOf('normal') */
          {
            use: [
              {
                loader: 'C:\\Share\\home\\sl-vue\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  hmr: false,
                  publicPath: '../'
                }
              },
              {
                loader: 'css-loader',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              {
                loader: 'postcss-loader',
                options: {
                  sourceMap: false
                }
              }
            ]
          }
        ]
      },
      /* config.module.rule('scss') */
      {
        test: /\.scss$/,
        oneOf: [
          /* config.module.rule('scss').oneOf('vue-modules') */
          {
            resourceQuery: /module/,
            use: [
              {
                loader: 'C:\\Share\\home\\sl-vue\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  hmr: false,
                  publicPath: '../'
                }
              },
              {
                loader: 'css-loader',
                options: {
                  sourceMap: false,
                  importLoaders: 2,
                  modules: true,
                  localIdentName: '[name]_[local]_[hash:base64:5]'
                }
              },
              {
                loader: 'postcss-loader',
                options: {
                  sourceMap: false
                }
              },
              {
                loader: 'sass-loader',
                options: {
                  sourceMap: false
                }
              }
            ]
          },
          /* config.module.rule('scss').oneOf('vue') */
          {
            resourceQuery: /\?vue/,
            use: [
              {
                loader: 'C:\\Share\\home\\sl-vue\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  hmr: false,
                  publicPath: '../'
                }
              },
              {
                loader: 'css-loader',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              {
                loader: 'postcss-loader',
                options: {
                  sourceMap: false
                }
              },
              {
                loader: 'sass-loader',
                options: {
                  sourceMap: false
                }
              }
            ]
          },
          /* config.module.rule('scss').oneOf('normal-modules') */
          {
            test: /\.module\.\w+$/,
            use: [
              {
                loader: 'C:\\Share\\home\\sl-vue\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  hmr: false,
                  publicPath: '../'
                }
              },
              {
                loader: 'css-loader',
                options: {
                  sourceMap: false,
                  importLoaders: 2,
                  modules: true,
                  localIdentName: '[name]_[local]_[hash:base64:5]'
                }
              },
              {
                loader: 'postcss-loader',
                options: {
                  sourceMap: false
                }
              },
              {
                loader: 'sass-loader',
                options: {
                  sourceMap: false
                }
              }
            ]
          },
          /* config.module.rule('scss').oneOf('normal') */
          {
            use: [
              {
                loader: 'C:\\Share\\home\\sl-vue\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  hmr: false,
                  publicPath: '../'
                }
              },
              {
                loader: 'css-loader',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              {
                loader: 'postcss-loader',
                options: {
                  sourceMap: false
                }
              },
              {
                loader: 'sass-loader',
                options: {
                  sourceMap: false
                }
              }
            ]
          }
        ]
      },
      /* config.module.rule('sass') */
      {
        test: /\.sass$/,
        oneOf: [
          /* config.module.rule('sass').oneOf('vue-modules') */
          {
            resourceQuery: /module/,
            use: [
              {
                loader: 'C:\\Share\\home\\sl-vue\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  hmr: false,
                  publicPath: '../'
                }
              },
              {
                loader: 'css-loader',
                options: {
                  sourceMap: false,
                  importLoaders: 2,
                  modules: true,
                  localIdentName: '[name]_[local]_[hash:base64:5]'
                }
              },
              {
                loader: 'postcss-loader',
                options: {
                  sourceMap: false
                }
              },
              {
                loader: 'sass-loader',
                options: {
                  sourceMap: false,
                  indentedSyntax: true
                }
              }
            ]
          },
          /* config.module.rule('sass').oneOf('vue') */
          {
            resourceQuery: /\?vue/,
            use: [
              {
                loader: 'C:\\Share\\home\\sl-vue\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  hmr: false,
                  publicPath: '../'
                }
              },
              {
                loader: 'css-loader',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              {
                loader: 'postcss-loader',
                options: {
                  sourceMap: false
                }
              },
              {
                loader: 'sass-loader',
                options: {
                  sourceMap: false,
                  indentedSyntax: true
                }
              }
            ]
          },
          /* config.module.rule('sass').oneOf('normal-modules') */
          {
            test: /\.module\.\w+$/,
            use: [
              {
                loader: 'C:\\Share\\home\\sl-vue\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  hmr: false,
                  publicPath: '../'
                }
              },
              {
                loader: 'css-loader',
                options: {
                  sourceMap: false,
                  importLoaders: 2,
                  modules: true,
                  localIdentName: '[name]_[local]_[hash:base64:5]'
                }
              },
              {
                loader: 'postcss-loader',
                options: {
                  sourceMap: false
                }
              },
              {
                loader: 'sass-loader',
                options: {
                  sourceMap: false,
                  indentedSyntax: true
                }
              }
            ]
          },
          /* config.module.rule('sass').oneOf('normal') */
          {
            use: [
              {
                loader: 'C:\\Share\\home\\sl-vue\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  hmr: false,
                  publicPath: '../'
                }
              },
              {
                loader: 'css-loader',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              {
                loader: 'postcss-loader',
                options: {
                  sourceMap: false
                }
              },
              {
                loader: 'sass-loader',
                options: {
                  sourceMap: false,
                  indentedSyntax: true
                }
              }
            ]
          }
        ]
      },
      /* config.module.rule('less') */
      {
        test: /\.less$/,
        oneOf: [
          /* config.module.rule('less').oneOf('vue-modules') */
          {
            resourceQuery: /module/,
            use: [
              {
                loader: 'C:\\Share\\home\\sl-vue\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  hmr: false,
                  publicPath: '../'
                }
              },
              {
                loader: 'css-loader',
                options: {
                  sourceMap: false,
                  importLoaders: 2,
                  modules: true,
                  localIdentName: '[name]_[local]_[hash:base64:5]'
                }
              },
              {
                loader: 'postcss-loader',
                options: {
                  sourceMap: false
                }
              },
              {
                loader: 'less-loader',
                options: {
                  sourceMap: false
                }
              }
            ]
          },
          /* config.module.rule('less').oneOf('vue') */
          {
            resourceQuery: /\?vue/,
            use: [
              {
                loader: 'C:\\Share\\home\\sl-vue\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  hmr: false,
                  publicPath: '../'
                }
              },
              {
                loader: 'css-loader',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              {
                loader: 'postcss-loader',
                options: {
                  sourceMap: false
                }
              },
              {
                loader: 'less-loader',
                options: {
                  sourceMap: false
                }
              }
            ]
          },
          /* config.module.rule('less').oneOf('normal-modules') */
          {
            test: /\.module\.\w+$/,
            use: [
              {
                loader: 'C:\\Share\\home\\sl-vue\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  hmr: false,
                  publicPath: '../'
                }
              },
              {
                loader: 'css-loader',
                options: {
                  sourceMap: false,
                  importLoaders: 2,
                  modules: true,
                  localIdentName: '[name]_[local]_[hash:base64:5]'
                }
              },
              {
                loader: 'postcss-loader',
                options: {
                  sourceMap: false
                }
              },
              {
                loader: 'less-loader',
                options: {
                  sourceMap: false
                }
              }
            ]
          },
          /* config.module.rule('less').oneOf('normal') */
          {
            use: [
              {
                loader: 'C:\\Share\\home\\sl-vue\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  hmr: false,
                  publicPath: '../'
                }
              },
              {
                loader: 'css-loader',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              {
                loader: 'postcss-loader',
                options: {
                  sourceMap: false
                }
              },
              {
                loader: 'less-loader',
                options: {
                  sourceMap: false
                }
              }
            ]
          }
        ]
      },
      /* config.module.rule('stylus') */
      {
        test: /\.styl(us)?$/,
        oneOf: [
          /* config.module.rule('stylus').oneOf('vue-modules') */
          {
            resourceQuery: /module/,
            use: [
              {
                loader: 'C:\\Share\\home\\sl-vue\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  hmr: false,
                  publicPath: '../'
                }
              },
              {
                loader: 'css-loader',
                options: {
                  sourceMap: false,
                  importLoaders: 2,
                  modules: true,
                  localIdentName: '[name]_[local]_[hash:base64:5]'
                }
              },
              {
                loader: 'postcss-loader',
                options: {
                  sourceMap: false
                }
              },
              {
                loader: 'stylus-loader',
                options: {
                  sourceMap: false,
                  preferPathResolver: 'webpack'
                }
              }
            ]
          },
          /* config.module.rule('stylus').oneOf('vue') */
          {
            resourceQuery: /\?vue/,
            use: [
              {
                loader: 'C:\\Share\\home\\sl-vue\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  hmr: false,
                  publicPath: '../'
                }
              },
              {
                loader: 'css-loader',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              {
                loader: 'postcss-loader',
                options: {
                  sourceMap: false
                }
              },
              {
                loader: 'stylus-loader',
                options: {
                  sourceMap: false,
                  preferPathResolver: 'webpack'
                }
              }
            ]
          },
          /* config.module.rule('stylus').oneOf('normal-modules') */
          {
            test: /\.module\.\w+$/,
            use: [
              {
                loader: 'C:\\Share\\home\\sl-vue\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  hmr: false,
                  publicPath: '../'
                }
              },
              {
                loader: 'css-loader',
                options: {
                  sourceMap: false,
                  importLoaders: 2,
                  modules: true,
                  localIdentName: '[name]_[local]_[hash:base64:5]'
                }
              },
              {
                loader: 'postcss-loader',
                options: {
                  sourceMap: false
                }
              },
              {
                loader: 'stylus-loader',
                options: {
                  sourceMap: false,
                  preferPathResolver: 'webpack'
                }
              }
            ]
          },
          /* config.module.rule('stylus').oneOf('normal') */
          {
            use: [
              {
                loader: 'C:\\Share\\home\\sl-vue\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  hmr: false,
                  publicPath: '../'
                }
              },
              {
                loader: 'css-loader',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              {
                loader: 'postcss-loader',
                options: {
                  sourceMap: false
                }
              },
              {
                loader: 'stylus-loader',
                options: {
                  sourceMap: false,
                  preferPathResolver: 'webpack'
                }
              }
            ]
          }
        ]
      },
      /* config.module.rule('js') */
      {
        test: /\.m?jsx?$/,
        exclude: [
          function () { /* omitted long function */ }
        ],
        use: [
          {
            loader: 'cache-loader',
            options: {
              cacheDirectory: 'C:\\Share\\home\\sl-vue\\node_modules\\.cache\\babel-loader',
              cacheIdentifier: '4d18ce41'
            }
          },
          {
            loader: 'thread-loader'
          },
          {
            loader: 'babel-loader'
          }
        ]
      },
      /* config.module.rule('eslint') */
      {
        enforce: 'pre',
        test: /\.(vue|(j|t)sx?)$/,
        exclude: [
          /node_modules/,
          'C:\\Share\\home\\sl-vue\\node_modules\\@vue\\cli-service\\lib'
        ],
        use: [
          {
            loader: 'eslint-loader',
            options: {
              extensions: [
                '.js',
                '.jsx',
                '.vue'
              ],
              cache: true,
              cacheIdentifier: '99d48332',
              emitWarning: true,
              emitError: false,
              eslintPath: 'C:\\Share\\home\\sl-vue\\node_modules\\eslint\\lib\\api.js',
              formatter: function () { /* omitted long function */ }
            }
          }
        ]
      }
    ]
  },
  optimization: {
    minimizer: [
      {
        options: {
          test: /\.m?js(\?.*)?$/i,
          chunkFilter: () => true,
          warningsFilter: () => true,
          extractComments: false,
          sourceMap: true,
          cache: true,
          cacheKeys: defaultCacheKeys => defaultCacheKeys,
          parallel: true,
          include: undefined,
          exclude: undefined,
          minify: undefined,
          terserOptions: {
            output: {
              comments: /^\**!|@preserve|@license|@cc_on/i
            },
            compress: {
              arrows: false,
              collapse_vars: false,
              comparisons: false,
              computed_props: false,
              hoist_funs: false,
              hoist_props: false,
              hoist_vars: false,
              inline: false,
              loops: false,
              negate_iife: false,
              properties: false,
              reduce_funcs: false,
              reduce_vars: false,
              switches: false,
              toplevel: false,
              typeofs: false,
              booleans: true,
              if_return: true,
              sequences: true,
              unused: true,
              conditionals: true,
              dead_code: true,
              evaluate: true
            },
            mangle: {
              safari10: true
            }
          }
        }
      }
    ],
    splitChunks: {
      cacheGroups: {
        vendors: {
          name: 'chunk-vendors',
          test: /[\\\/]node_modules[\\\/]/,
          priority: -10,
          chunks: 'initial'
        },
        common: {
          name: 'chunk-common',
          minChunks: 2,
          priority: -20,
          chunks: 'initial',
          reuseExistingChunk: true
        }
      }
    }
  },
  plugins: [
    /* config.plugin('vue-loader') */
    new VueLoaderPlugin(),
    /* config.plugin('define') */
    new DefinePlugin(
      {
        'process.env': {
          NODE_ENV: '"production"',
          BASE_URL: '"/"'
        }
      }
    ),
    /* config.plugin('case-sensitive-paths') */
    new CaseSensitivePathsPlugin(),
    /* config.plugin('friendly-errors') */
    new FriendlyErrorsWebpackPlugin(
      {
        additionalTransformers: [
          function () { /* omitted long function */ }
        ],
        additionalFormatters: [
          function () { /* omitted long function */ }
        ]
      }
    ),
    /* config.plugin('extract-css') */
    new MiniCssExtractPlugin(
      {
        filename: 'css/[name].[contenthash:8].css',
        chunkFilename: 'css/[name].[contenthash:8].css'
      }
    ),
    /* config.plugin('optimize-css') */
    new OptimizeCssnanoPlugin(
      {
        sourceMap: false,
        cssnanoOptions: {
          preset: [
            'default',
            {
              mergeLonghand: false,
              cssDeclarationSorter: false
            }
          ]
        }
      }
    ),
    /* config.plugin('hash-module-ids') */
    new HashedModuleIdsPlugin(
      {
        hashDigest: 'hex'
      }
    ),
    /* config.plugin('named-chunks') */
    new NamedChunksPlugin(
      function () { /* omitted long function */ }
    ),
    /* config.plugin('html') */
    new HtmlWebpackPlugin(
      {
        templateParameters: function () { /* omitted long function */ },
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true,
          collapseBooleanAttributes: true,
          removeScriptTypeAttributes: true
        },
        template: 'C:\\Share\\home\\sl-vue\\public\\index.html'
      }
    ),
    /* config.plugin('pwa') */
    new HtmlPwaPlugin(
      {
        name: 'sl-vue'
      }
    ),
    /* config.plugin('preload') */
    new PreloadPlugin(
      {
        rel: 'preload',
        include: 'initial',
        fileBlacklist: [
          /\.map$/,
          /hot-update\.js$/
        ]
      }
    ),
    /* config.plugin('prefetch') */
    new PreloadPlugin(
      {
        rel: 'prefetch',
        include: 'asyncChunks'
      }
    ),
    /* config.plugin('copy') */
    new CopyWebpackPlugin(
      [
        {
          from: 'C:\\Share\\home\\sl-vue\\public',
          to: 'C:\\Share\\home\\sl-vue\\dist',
          toType: 'dir',
          ignore: [
            '.DS_Store'
          ]
        }
      ]
    ),
    /* config.plugin('workbox') */
    new GenerateSW(
      {
        exclude: [
          /\.map$/,
          /img\/icons\//,
          /favicon\.ico$/,
          /manifest\.json$/
        ],
        cacheId: 'sl-vue'
      }
    ),
    {
      options: {
        resourceRegExp: /config\/abi\//,
        contextRegExp: undefined
      },
      checkIgnore: function () { [native code] }
    },
    {
      options: {
        resourceRegExp: /config\/server\//,
        contextRegExp: undefined
      },
      checkIgnore: function () { [native code] }
    },
    {
      options: {
        resourceRegExp: /server\//,
        contextRegExp: undefined
      },
      checkIgnore: function () { [native code] }
    },
    {
      options: {
        resourceRegExp: /tests\//,
        contextRegExp: undefined
      },
      checkIgnore: function () { [native code] }
    },
    {
      options: {
        resourceRegExp: /contracts\//,
        contextRegExp: undefined
      },
      checkIgnore: function () { [native code] }
    }
  ],
  entry: {
    app: [
      './src/main.js'
    ]
  }
}
