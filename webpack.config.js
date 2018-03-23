'use strict'
module.exports = config
function config(env) {
	const htmlStandards = require('reshape-standard')
	    , cssStandards = require('spike-css-standards')
	    , sugarml = require('sugarml')
	    , webpack = require('webpack')
	    , path = require('path')
	    , ManifestPlugin = require('webpack-manifest-plugin')
	    , CleanWebpackPlugin = require('clean-webpack-plugin')
	    , HtmlWebpackPlugin = require('html-webpack-plugin')
	    , CopyWebpackPlugin = require('copy-webpack-plugin')
	    , ExtractTextPlugin = require("extract-text-webpack-plugin")
	    , ATLoader = require('awesome-typescript-loader')
	    , isProd = env && env.NODE_ENV === 'production'
	    , buildDir = path.resolve(__dirname, 'public')
	    , chunk = [ 'index'
	              , 'powershell-remoting'
	              ]
	return { context: path.resolve(__dirname, 'views')
	       , entry: entrySet(chunk)
	       , output:
	         Object.assign
	         ( { path: buildDir }
	         , { filename: osPath('script/[name].[hash].js')
	           , chunkFilename: osPath('script/[id].[chunkhash].chunk.js')
	           }
	         )
	       , module:
	         { rules:
	           [ postcssRule(/\.css$/)
	           , postcssRule(/\.sss$/, 'sugarss')
	           , { test: /\.sgr$/
	             , use:
	               [ { loader: 'html-loader'
	                 , options:
	                   { // attrs:
	                   //   [ ':src'
	                   //   , 'link:href'
	                   //   , 'object:data'
	                   //   ]
	                   // , 
	                     minimize: isProd
	                   }
	                 }
	               , { loader: 'reshape-loader'
	                 , options: Object.assign
	                   ( htmlStandards
	                     ({ parser: sugarml
		                    , minify: isProd
	                      , locals: function locals(ctx) {
		                      let rel = path.relative( ctx.context
		                                             , ctx.resourcePath
		                                             )
		                        , pageId = path.join( path.dirname(rel)
		                                            , path.basename(rel).replace(/\..*/g, '')
		                                            ).replace(/[\\\/]/g, '-')
		                      return { ctx
		                             , pageId
		                             , title: pageId
		                             }
	                      }
	                      })
	                   , { generatorOptions:
	                       { selfClosing: 'slash' }
	                     }
	                   )
	                 }
	               ]
	             }
	           , { test: /\.[jt]sx?$/
	             , use:
	               [ { loader: 'awesome-typescript-loader'
	                 , options:
	                   { useTranspileModule: true
	                   , transpileOnly: true
	                   }
	                 }
	               ]
	             }
	           , { test: /\.svg$/
	             , use: [ fileLoader(undefined, 'image/') ]
	             }
	           ]
	         }
	       , resolve:
	         { extensions:
	           [ '.js'
	           , '.json'
	           , '.ts'
	           , '.tsx'
	           ]
	         }
	       , devtool: 'source-map'
	       , devServer:
	         { contentBase: buildDir
	         , hot: !isProd
	         }
	       , plugins:
	         [ new CleanWebpackPlugin([buildDir])
	         , new CopyWebpackPlugin
	           ([{ from: { glob: osPath('./image/*') } }])
	         // , new ATLoader.CheckerPlugin
	         , ...hwpArray(chunk)
	         , new ExtractTextPlugin
	           ({ filename: osPath('style/[name].[contenthash].css')
	            , allChunks: true
	           })
	         , new ManifestPlugin
	         , new webpack.NamedModulesPlugin
	         // , new webpack.optimize.CommonsChunkPlugin
	         //   ({ name: 'vendor'
	         //    , minChunks:
	         //      function minChunks(module) {
		       //        return module.context
		       //            && module.context.includes('node_modules')
	         //      }
	         //    })
	         , ...( isProd
	              ? [ new webpack.optimize.CommonsChunkPlugin
	                  ({ name: 'common'
	                   , minChunks: 2
	                   })
	                , new webpack.optimize.CommonsChunkPlugin
	                  ({ name: 'manifest'
	                   , minChunks: Infinity
	                   })
	                ]
	              : [ new webpack.HotModuleReplacementPlugin ]
	              )
	         ]
	       }
	function entrySet(names) {
		let entry = {}
		for (let name of names) {
			entry[name] = osPath(`./${name}`)
		}
		return entry
	}
	// chunk: string[] array of chunk names
	function hwpArray(chunk) {
		let hwpOptions = isProd
		               ? hwpOptionsProd
		               : hwpOptionsDev
		return chunk
		       .map((name) =>
		          new HtmlWebpackPlugin(hwpOptions(name))
		         )
	}
	function hwpOptionsDev(name) {
		return { template: osPath(`./${name}.sgr`)
		       , filename: `${name}.html`
		       , xhtml: true
		       , chunks: [name]
		       }
	}
	function hwpOptionsProd(name) {
		let options = hwpOptionsDev(name)
		options.chunks.unshift('manifest', 'common')
		return options
	}
	function osPath(posixPath) {
		return path.sep === '/'
		     ? posixPath
		     : posixPath.replace(/\//g, path.sep)
	}
	function postcssRule(test, parser) {
		return { test
		       , use:
		         ExtractTextPlugin.extract
		         ({ use:
		            [ // fileLoader('css', 'style/')
			            // , { loader: 'extract-loader' }
			            // , 
			            { loader: 'css-loader'
			            , options: { importLoaders: 1 }
			            }
			          , { loader: 'postcss-loader'
			            , options:
			              cssStandards
			              ({ parser
			               , minify: isProd
			               , warnForDuplicates: !isProd
			               })
			            }
		            ]
		          })
		       }
	}
	function fileLoader(ext = '[ext]', publicPath) {
		let options = { name: `[name].[hash].${ext}`
		              }
		if (publicPath) {
			Object.assign
			( options
			, { outputPath: osPath(publicPath)
			  , publicPath
			  }
			)
		}
		return { loader: 'file-loader'
		       , options
		       }
	}
	// console.dir
	// ( module.exports
	// , { depth: 7
	//   , colors: true
	//   }
	// )
}