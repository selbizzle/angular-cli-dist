// ExtractTextPlugin leaves behind the entry points, which we might not need anymore
// if they were entirely css. This plugin removes those entry points.
"use strict";
var SuppressEntryChunksWebpackPlugin = (function () {
    function SuppressEntryChunksWebpackPlugin(options) {
        this.options = options;
    }
    SuppressEntryChunksWebpackPlugin.prototype.apply = function (compiler) {
        var chunks = this.options.chunks;
        compiler.plugin('compilation', function (compilation) {
            // Remove the js file for supressed chunks
            compilation.plugin('after-seal', function (callback) {
                compilation.chunks
                    .filter(function (chunk) { return chunks.indexOf(chunk.name) !== -1; })
                    .forEach(function (chunk) {
                    var newFiles = [];
                    chunk.files.forEach(function (file) {
                        if (file.match(/\.js$/)) {
                            // remove js files
                            delete compilation.assets[file];
                        }
                        else {
                            newFiles.push(file);
                        }
                    });
                    chunk.files = newFiles;
                });
                callback();
            });
            // Remove scripts tags with a css file as source, because HtmlWebpackPlugin will use
            // a css file as a script for chunks without js files.
            compilation.plugin('html-webpack-plugin-alter-asset-tags', function (htmlPluginData, callback) {
                var filterFn = function (tag) {
                    return !(tag.tagName === 'script' && tag.attributes.src.match(/\.css$/));
                };
                htmlPluginData.head = htmlPluginData.head.filter(filterFn);
                htmlPluginData.body = htmlPluginData.body.filter(filterFn);
                callback(null, htmlPluginData);
            });
        });
    };
    return SuppressEntryChunksWebpackPlugin;
}());
exports.SuppressEntryChunksWebpackPlugin = SuppressEntryChunksWebpackPlugin;
//# sourceMappingURL=C:/Users/selbype/git/angular-cli-master/packages/angular-cli/plugins/suppress-entry-chunks-webpack-plugin.js.map