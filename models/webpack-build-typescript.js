"use strict";
var path = require('path');
var webpack_1 = require('@ngtools/webpack');
var g = global;
var webpackLoader = g['angularCliIsLocal']
    ? g.angularCliPackages['@ngtools/webpack'].main
    : '@ngtools/webpack';
exports.getWebpackNonAotConfigPartial = function (projectRoot, appConfig) {
    return {
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    loader: webpackLoader,
                    exclude: [/\.(spec|e2e)\.ts$/]
                }
            ]
        },
        plugins: [
            new webpack_1.AotPlugin({
                tsConfigPath: path.resolve(projectRoot, appConfig.root, appConfig.tsconfig),
                mainPath: path.join(projectRoot, appConfig.root, appConfig.main),
                exclude: [
                    path.join(projectRoot, appConfig.root, appConfig.test),
                    '**/*.spec.ts'
                ],
                skipCodeGeneration: true
            }),
        ]
    };
};
exports.getWebpackAotConfigPartial = function (projectRoot, appConfig, i18nFile, i18nFormat, locale) {
    return {
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    loader: webpackLoader,
                    exclude: [/\.(spec|e2e)\.ts$/]
                }
            ]
        },
        plugins: [
            new webpack_1.AotPlugin({
                tsConfigPath: path.resolve(projectRoot, appConfig.root, appConfig.tsconfig),
                mainPath: path.join(projectRoot, appConfig.root, appConfig.main),
                i18nFile: i18nFile,
                i18nFormat: i18nFormat,
                locale: locale,
                exclude: [
                    path.join(projectRoot, appConfig.root, appConfig.test),
                    '**/*.spec.ts'
                ]
            })
        ]
    };
};
//# sourceMappingURL=C:/Users/selbype/git/angular-cli-master/packages/angular-cli/models/webpack-build-typescript.js.map