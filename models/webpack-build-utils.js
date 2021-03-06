"use strict";
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
/**
 * Enumerate loaders and their dependencies from this file to let the dependency validator
 * know they are used.
 *
 * require('raw-loader')
 * require('style-loader')
 * require('postcss-loader')
 * require('css-loader')
 * require('stylus-loader')
 * require('less-loader')
 * require('sass-loader')
 *
 * require('node-sass')
 * require('less')
 * require('stylus')
 */
exports.ngAppResolve = function (resolvePath) {
    return path.resolve(process.cwd(), resolvePath);
};
var webpackOutputOptions = {
    colors: true,
    hash: true,
    timings: true,
    chunks: true,
    chunkModules: false,
    children: false,
    modules: false,
    reasons: false,
    warnings: true,
    assets: false,
    version: false
};
var verboseWebpackOutputOptions = {
    children: true,
    assets: true,
    version: true,
    reasons: true,
    chunkModules: false // TODO: set to true when console to file output is fixed
};
function getWebpackStatsConfig(verbose) {
    if (verbose === void 0) { verbose = false; }
    return verbose
        ? Object.assign(webpackOutputOptions, verboseWebpackOutputOptions)
        : webpackOutputOptions;
}
exports.getWebpackStatsConfig = getWebpackStatsConfig;
// create array of css loaders
function makeCssLoaders(stylePaths) {
    if (stylePaths === void 0) { stylePaths = []; }
    var baseRules = [
        { test: /\.css$/, loaders: [] },
        { test: /\.scss$|\.sass$/, loaders: ['sass-loader'] },
        { test: /\.less$/, loaders: ['less-loader'] },
        { test: /\.styl$/, loaders: ['stylus-loader'] }
    ];
    var commonLoaders = ['postcss-loader'];
    // load component css as raw strings
    var cssLoaders = baseRules.map(function (_a) {
        var test = _a.test, loaders = _a.loaders;
        return ({
            exclude: stylePaths, test: test, loaders: ['raw-loader'].concat(commonLoaders, loaders)
        });
    });
    if (stylePaths.length > 0) {
        // load global css as css files
        cssLoaders.push.apply(cssLoaders, baseRules.map(function (_a) {
            var test = _a.test, loaders = _a.loaders;
            return ({
                include: stylePaths, test: test, loaders: ExtractTextPlugin.extract({
                    remove: false,
                    loader: ['css-loader'].concat(commonLoaders, loaders),
                    fallbackLoader: 'style-loader'
                })
            });
        }));
    }
    return cssLoaders;
}
exports.makeCssLoaders = makeCssLoaders;
// convert all extra entries into the object representation, fill in defaults
function extraEntryParser(extraEntries, appRoot, defaultEntry) {
    return extraEntries
        .map(function (extraEntry) {
        return typeof extraEntry === 'string' ? { input: extraEntry } : extraEntry;
    })
        .map(function (extraEntry) {
        extraEntry.path = path.resolve(appRoot, extraEntry.input);
        if (extraEntry.output) {
            extraEntry.entry = extraEntry.output.replace(/\.(js|css)$/i, '');
        }
        else if (extraEntry.lazy) {
            extraEntry.entry = extraEntry.input.replace(/\.(js|css|scss|sass|less|styl)$/i, '');
        }
        else {
            extraEntry.entry = defaultEntry;
        }
        return extraEntry;
    });
}
exports.extraEntryParser = extraEntryParser;
//# sourceMappingURL=C:/Users/selbype/git/angular-cli-master/packages/angular-cli/models/webpack-build-utils.js.map