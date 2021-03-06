"use strict";
var webpack_build_typescript_1 = require('./webpack-build-typescript');
var webpackMerge = require('webpack-merge');
var config_1 = require('./config');
var webpack_build_common_1 = require('./webpack-build-common');
var webpack_build_development_1 = require('./webpack-build-development');
var webpack_build_production_1 = require('./webpack-build-production');
var webpack_build_mobile_1 = require('./webpack-build-mobile');
var NgCliWebpackConfig = (function () {
    function NgCliWebpackConfig(ngCliProject, target, environment, outputDir, baseHref, i18nFile, i18nFormat, locale, isAoT, sourcemap, vendorChunk, verbose, progress) {
        if (isAoT === void 0) { isAoT = false; }
        if (sourcemap === void 0) { sourcemap = true; }
        if (vendorChunk === void 0) { vendorChunk = false; }
        if (verbose === void 0) { verbose = false; }
        if (progress === void 0) { progress = true; }
        this.ngCliProject = ngCliProject;
        this.target = target;
        this.environment = environment;
        var config = config_1.CliConfig.fromProject();
        var appConfig = config.config.apps[0];
        appConfig.outDir = outputDir || appConfig.outDir;
        var baseConfig = webpack_build_common_1.getWebpackCommonConfig(this.ngCliProject.root, environment, appConfig, baseHref, sourcemap, vendorChunk, verbose, progress);
        var targetConfigPartial = this.getTargetConfig(this.ngCliProject.root, appConfig, sourcemap, verbose);
        var typescriptConfigPartial = isAoT
            ? webpack_build_typescript_1.getWebpackAotConfigPartial(this.ngCliProject.root, appConfig, i18nFile, i18nFormat, locale)
            : webpack_build_typescript_1.getWebpackNonAotConfigPartial(this.ngCliProject.root, appConfig);
        if (appConfig.mobile) {
            var mobileConfigPartial = webpack_build_mobile_1.getWebpackMobileConfigPartial(this.ngCliProject.root, appConfig);
            var mobileProdConfigPartial = webpack_build_mobile_1.getWebpackMobileProdConfigPartial(this.ngCliProject.root, appConfig);
            baseConfig = webpackMerge(baseConfig, mobileConfigPartial);
            if (this.target == 'production') {
                targetConfigPartial = webpackMerge(targetConfigPartial, mobileProdConfigPartial);
            }
        }
        this.config = webpackMerge(baseConfig, targetConfigPartial, typescriptConfigPartial);
    }
    NgCliWebpackConfig.prototype.getTargetConfig = function (projectRoot, appConfig, sourcemap, verbose) {
        switch (this.target) {
            case 'development':
                return webpack_build_development_1.getWebpackDevConfigPartial(projectRoot, appConfig);
            case 'production':
                return webpack_build_production_1.getWebpackProdConfigPartial(projectRoot, appConfig, sourcemap, verbose);
            default:
                throw new Error("Invalid build target. Only 'development' and 'production' are available.");
        }
    };
    return NgCliWebpackConfig;
}());
exports.NgCliWebpackConfig = NgCliWebpackConfig;
//# sourceMappingURL=C:/Users/selbype/git/angular-cli-master/packages/angular-cli/models/webpack-config.js.map