"use strict";
var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var compression_plugin_1 = require('../lib/webpack/compression-plugin');
var autoprefixer = require('autoprefixer');
var postcssDiscardComments = require('postcss-discard-comments');
exports.getWebpackProdConfigPartial = function (projectRoot, appConfig, sourcemap, verbose) {
    var appRoot = path.resolve(projectRoot, appConfig.root);
    return {
        output: {
            filename: '[name].[chunkhash].bundle.js',
            sourceMapFilename: '[name].[chunkhash].bundle.map',
            chunkFilename: '[id].[chunkhash].chunk.js'
        },
        plugins: [
            new ExtractTextPlugin('[name].[chunkhash].bundle.css'),
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify('production')
            }),
            new webpack.LoaderOptionsPlugin({ minimize: true }),
            new webpack.optimize.UglifyJsPlugin({
                mangle: { screw_ie8: true },
                compress: { screw_ie8: true, warnings: verbose },
                sourceMap: sourcemap
            }),
            new compression_plugin_1.CompressionPlugin({
                asset: '[path].gz[query]',
                algorithm: 'gzip',
                test: /\.js$|\.html$|\.css$/,
                threshold: 10240
            }),
            // LoaderOptionsPlugin needs to be fully duplicated because webpackMerge will replace it.
            new webpack.LoaderOptionsPlugin({
                test: /\.(css|scss|sass|less|styl)$/,
                options: {
                    postcss: [
                        autoprefixer(),
                        postcssDiscardComments
                    ],
                    cssLoader: { sourceMap: sourcemap },
                    sassLoader: { sourceMap: sourcemap },
                    lessLoader: { sourceMap: sourcemap },
                    stylusLoader: { sourceMap: sourcemap },
                    // context needed as a workaround https://github.com/jtangelder/sass-loader/issues/285
                    context: projectRoot,
                }
            })
        ]
    };
};
//# sourceMappingURL=C:/Users/selbype/git/angular-cli-master/packages/angular-cli/models/webpack-build-production.js.map