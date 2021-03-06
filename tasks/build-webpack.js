"use strict";
var rimraf = require('rimraf');
var path = require('path');
var Task = require('../ember-cli/lib/models/task');
var webpack = require('webpack');
var webpack_config_1 = require('../models/webpack-config');
var _1 = require('../models/');
var config_1 = require('../models/config');
// Configure build and output;
var lastHash = null;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Task.extend({
    run: function (runTaskOptions) {
        var _this = this;
        var project = this.cliProject;
        var outputDir = runTaskOptions.outputPath || config_1.CliConfig.fromProject().config.apps[0].outDir;
        rimraf.sync(path.resolve(project.root, outputDir));
        var config = new webpack_config_1.NgCliWebpackConfig(project, runTaskOptions.target, runTaskOptions.environment, outputDir, runTaskOptions.baseHref, runTaskOptions.i18nFile, runTaskOptions.i18nFormat, runTaskOptions.locale, runTaskOptions.aot, runTaskOptions.sourcemap, runTaskOptions.vendorChunk, runTaskOptions.verbose, runTaskOptions.progress).config;
        var webpackCompiler = webpack(config);
        var statsConfig = _1.getWebpackStatsConfig(runTaskOptions.verbose);
        return new Promise(function (resolve, reject) {
            webpackCompiler.run(function (err, stats) {
                if (err) {
                    return reject(err);
                }
                // Don't keep cache
                // TODO: Make conditional if using --watch
                webpackCompiler.purgeInputFileSystem();
                if (stats.hash !== lastHash) {
                    lastHash = stats.hash;
                    process.stdout.write(stats.toString(statsConfig) + '\n');
                }
                if (stats.hasErrors()) {
                    reject();
                }
                else {
                    resolve();
                }
            });
        })
            .catch(function (err) {
            if (err) {
                _this.ui.writeError('\nAn error occured during the build:\n' + ((err && err.stack) || err));
            }
            throw err;
        });
    }
});
//# sourceMappingURL=C:/Users/selbype/git/angular-cli-master/packages/angular-cli/tasks/build-webpack.js.map