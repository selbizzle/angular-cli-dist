"use strict";
var Command = require('../ember-cli/lib/models/command');
var path = require('path');
var child_process = require('child_process');
var VersionCommand = Command.extend({
    name: 'version',
    description: 'outputs angular-cli version',
    aliases: ['v', '--version', '-v'],
    works: 'everywhere',
    availableOptions: [{
            name: 'verbose',
            type: Boolean, 'default': false
        }],
    run: function (options) {
        var _this = this;
        var versions = process.versions;
        var pkg = require(path.resolve(__dirname, '..', 'package.json'));
        var projPkg;
        try {
            projPkg = require(path.resolve(this.project.root, 'package.json'));
        }
        catch (exception) {
            projPkg = undefined;
        }
        versions.os = process.platform + ' ' + process.arch;
        var alwaysPrint = ['node', 'os'];
        var roots = ['@angular/', '@ngtools/'];
        var ngCliVersion = pkg.version;
        if (!__dirname.match(/node_modules/)) {
            var gitBranch = '??';
            try {
                var gitRefName = '' + child_process.execSync('git symbolic-ref HEAD', { cwd: __dirname });
                gitBranch = path.basename(gitRefName.replace('\n', ''));
            }
            catch (e) {
            }
            ngCliVersion = "local (v" + pkg.version + ", branch: " + gitBranch + ")";
        }
        if (projPkg) {
            roots.forEach(function (root) {
                versions = Object.assign(versions, _this.getDependencyVersions(projPkg, root));
            });
        }
        this.printVersion('angular-cli', ngCliVersion);
        var _loop_1 = function(module_1) {
            var isRoot = roots.some(function (root) { return module_1.startsWith(root); });
            if (options.verbose || alwaysPrint.indexOf(module_1) > -1 || isRoot) {
                this_1.printVersion(module_1, versions[module_1]);
            }
        };
        var this_1 = this;
        for (var _i = 0, _a = Object.keys(versions); _i < _a.length; _i++) {
            var module_1 = _a[_i];
            _loop_1(module_1);
        }
    },
    getDependencyVersions: function (pkg, prefix) {
        var _this = this;
        var modules = {};
        Object.keys(pkg.dependencies || {})
            .concat(Object.keys(pkg.devDependencies || {}))
            .filter(function (depName) { return depName && depName.startsWith(prefix); })
            .forEach(function (key) { return modules[key] = _this.getVersion(key); });
        return modules;
    },
    getVersion: function (moduleName) {
        var modulePkg = require(path.resolve(this.project.root, 'node_modules', moduleName, 'package.json'));
        return modulePkg.version;
    },
    printVersion: function (module, version) {
        this.ui.writeLine(module + ': ' + version);
    }
});
VersionCommand.overrideCore = true;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = VersionCommand;
//# sourceMappingURL=C:/Users/selbype/git/angular-cli-master/packages/angular-cli/commands/version.js.map