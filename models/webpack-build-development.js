"use strict";
var ExtractTextPlugin = require('extract-text-webpack-plugin');
exports.getWebpackDevConfigPartial = function (projectRoot, appConfig) {
    return {
        output: {
            filename: '[name].bundle.js',
            sourceMapFilename: '[name].bundle.map',
            chunkFilename: '[id].chunk.js'
        },
        plugins: [
            new ExtractTextPlugin({ filename: '[name].bundle.css' })
        ]
    };
};
//# sourceMappingURL=C:/Users/selbype/git/angular-cli-master/packages/angular-cli/models/webpack-build-development.js.map