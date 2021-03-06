"use strict";
var rimraf = require('rimraf');
var path = require('path');
var Task = require('../ember-cli/lib/models/task');
var webpack = require('webpack');
var webpack_config_1 = require('../models/webpack-config');
var _1 = require('../models/');
var config_1 = require('../models/config');
var lastHash = null;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Task.extend({
    run: function (runTaskOptions) {
        var project = this.cliProject;
        var outputDir = runTaskOptions.outputPath || config_1.CliConfig.fromProject().config.apps[0].outDir;
        rimraf.sync(path.resolve(project.root, outputDir));
        var config = new webpack_config_1.NgCliWebpackConfig(project, runTaskOptions.target, runTaskOptions.environment, outputDir, runTaskOptions.baseHref, runTaskOptions.i18nFile, runTaskOptions.i18nFormat, runTaskOptions.locale, runTaskOptions.aot, runTaskOptions.sourcemap, runTaskOptions.vendorChunk, runTaskOptions.verbose, runTaskOptions.progress).config;
        var webpackCompiler = webpack(config);
        var statsConfig = _1.getWebpackStatsConfig(runTaskOptions.verbose);
        return new Promise(function (resolve, reject) {
            webpackCompiler.watch({}, function (err, stats) {
                if (err) {
                    lastHash = null;
                    console.error(err.stack || err);
                    if (err.details) {
                        console.error(err.details);
                    }
                    reject(err.details);
                }
                if (stats.hash !== lastHash) {
                    lastHash = stats.hash;
                    process.stdout.write(stats.toString(statsConfig) + '\n');
                }
            });
        });
    }
});
//# sourceMappingURL=C:/Users/selbype/git/angular-cli-master/packages/angular-cli/tasks/build-webpack-watch.js.map