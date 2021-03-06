"use strict";
var Command = require('../ember-cli/lib/models/command');
var SilentError = require('silent-error');
var denodeify = require('denodeify');
var child_process_1 = require('child_process');
var chalk = require('chalk');
var fs = require('fs');
var fse = require('fs-extra');
var path = require('path');
var build_webpack_1 = require('../tasks/build-webpack');
var create_github_repo_1 = require('../tasks/create-github-repo');
var config_1 = require('../models/config');
var common_tags_1 = require('common-tags');
var fsReadDir = denodeify(fs.readdir);
var fsCopy = denodeify(fse.copy);
var githubPagesDeployCommand = Command.extend({
    name: 'github-pages:deploy',
    aliases: ['gh-pages:deploy'],
    description: (_a = ["\n    Build the test app for production, commit it into a git branch,\n    setup GitHub repo and push to it\n  "], _a.raw = ["\n    Build the test app for production, commit it into a git branch,\n    setup GitHub repo and push to it\n  "], common_tags_1.oneLine(_a)),
    works: 'insideProject',
    availableOptions: [
        {
            name: 'message',
            type: String,
            default: 'new gh-pages version',
            description: 'The commit message to include with the build, must be wrapped in quotes.'
        }, {
            name: 'target',
            type: String,
            default: 'production',
            aliases: ['t', { 'dev': 'development' }, { 'prod': 'production' }]
        }, {
            name: 'environment',
            type: String,
            default: '',
            aliases: ['e']
        }, {
            name: 'user-page',
            type: Boolean,
            default: false,
            description: 'Deploy as a user/org page'
        }, {
            name: 'skip-build',
            type: Boolean,
            default: false,
            description: 'Skip building the project before deploying'
        }, {
            name: 'gh-token',
            type: String,
            default: '',
            description: 'Github token'
        }, {
            name: 'gh-username',
            type: String,
            default: '',
            description: 'Github username'
        }, {
            name: 'base-href',
            type: String,
            default: null,
            aliases: ['bh']
        }],
    run: function (options, rawArgs) {
        var ui = this.ui;
        var root = this.project.root;
        var execOptions = {
            cwd: root
        };
        if (options.environment === '') {
            if (options.target === 'development') {
                options.environment = 'dev';
            }
            if (options.target === 'production') {
                options.environment = 'prod';
            }
        }
        var projectName = this.project.pkg.name;
        var outDir = config_1.CliConfig.fromProject().config.apps[0].outDir;
        var indexFilename = config_1.CliConfig.fromProject().config.apps[0].index;
        var ghPagesBranch = 'gh-pages';
        var destinationBranch = options.userPage ? 'master' : ghPagesBranch;
        var initialBranch;
        var branchErrMsg = ' You might also need to return to the initial branch manually.';
        // declared here so that tests can stub exec
        var execPromise = denodeify(child_process_1.exec);
        var buildTask = new build_webpack_1.default({
            ui: this.ui,
            analytics: this.analytics,
            cliProject: this.project,
            target: options.target,
            environment: options.environment,
            outputPath: outDir
        });
        /**
         * BaseHref tag setting logic:
         * First, use --base-href flag value if provided.
         * Else if --user-page is true, then keep baseHref default as declared in index.html.
         * Otherwise auto-replace with `/${projectName}/`.
         */
        var baseHref = options.baseHref || (options.userPage ? null : "/" + projectName + "/");
        var buildOptions = {
            target: options.target,
            environment: options.environment,
            outputPath: outDir,
            baseHref: baseHref,
        };
        var createGithubRepoTask = new create_github_repo_1.default({
            ui: this.ui,
            analytics: this.analytics,
            project: this.project
        });
        var createGithubRepoOptions = {
            projectName: projectName,
            ghUsername: options.ghUsername,
            ghToken: options.ghToken
        };
        return checkForPendingChanges()
            .then(build)
            .then(saveStartingBranchName)
            .then(createGitHubRepoIfNeeded)
            .then(checkoutGhPages)
            .then(cleanGhPagesBranch)
            .then(copyFiles)
            .then(createNotFoundPage)
            .then(addAndCommit)
            .then(returnStartingBranch)
            .then(pushToGitRepo)
            .then(printProjectUrl)
            .catch(failGracefully);
        function checkForPendingChanges() {
            return execPromise('git status --porcelain')
                .then(function (stdout) {
                if (/\w+/m.test(stdout)) {
                    var msg = 'Uncommitted file changes found! Please commit all changes before deploying.';
                    return Promise.reject(new SilentError(msg));
                }
            });
        }
        function build() {
            if (options.skipBuild) {
                return Promise.resolve();
            }
            return buildTask.run(buildOptions);
        }
        function saveStartingBranchName() {
            return execPromise('git rev-parse --abbrev-ref HEAD')
                .then(function (stdout) { return initialBranch = stdout.replace(/\s/g, ''); });
        }
        function createGitHubRepoIfNeeded() {
            return execPromise('git remote -v')
                .then(function (stdout) {
                if (!/origin\s+(https:\/\/|git@)github\.com/m.test(stdout)) {
                    return createGithubRepoTask.run(createGithubRepoOptions)
                        .then(function () {
                        // only push starting branch if it's not the destinationBranch
                        // this happens commonly when using github user pages, since
                        // they require the destination branch to be 'master'
                        if (destinationBranch !== initialBranch) {
                            execPromise("git push -u origin " + initialBranch);
                        }
                    });
                }
            });
        }
        function checkoutGhPages() {
            return execPromise("git checkout " + ghPagesBranch)
                .catch(createGhPagesBranch);
        }
        function createGhPagesBranch() {
            return execPromise("git checkout --orphan " + ghPagesBranch)
                .then(function () { return execPromise('git rm --cached -r .', execOptions); })
                .then(function () { return execPromise('git add .gitignore', execOptions); })
                .then(function () { return execPromise('git clean -f -d', execOptions); })
                .then(function () { return execPromise("git commit -m \"initial " + ghPagesBranch + " commit\""); });
        }
        function cleanGhPagesBranch() {
            return execPromise('git ls-files')
                .then(function (stdout) {
                var files = '';
                stdout.split(/\n/).forEach(function (f) {
                    // skip .gitignore & 404.html
                    if ((f != '') && (f != '.gitignore') && (f != '404.html')) {
                        files = files.concat("\"" + f + "\" ");
                    }
                });
                return execPromise("git rm -r " + files)
                    .catch(function () {
                    // Ignoring errors when trying to erase files.
                });
            });
        }
        function copyFiles() {
            return fsReadDir(outDir)
                .then(function (files) { return Promise.all(files.map(function (file) {
                if (file === '.gitignore') {
                    // don't overwrite the .gitignore file
                    return Promise.resolve();
                }
                return fsCopy(path.join(outDir, file), path.join('.', file));
            })); });
        }
        function createNotFoundPage() {
            var indexHtml = path.join(root, indexFilename);
            var notFoundPage = path.join(root, '404.html');
            return fsCopy(indexHtml, notFoundPage);
        }
        function addAndCommit() {
            return execPromise('git add .', execOptions)
                .then(function () { return execPromise("git commit -m \"" + options.message + "\""); })
                .catch(function () {
                var msg = 'No changes found. Deployment skipped.';
                return returnStartingBranch()
                    .then(function () { return Promise.reject(new SilentError(msg)); })
                    .catch(function () { return Promise.reject(new SilentError(msg.concat(branchErrMsg))); });
            });
        }
        function returnStartingBranch() {
            return execPromise("git checkout " + initialBranch);
        }
        function pushToGitRepo() {
            return execPromise("git push origin " + ghPagesBranch + ":" + destinationBranch)
                .catch(function (err) { return returnStartingBranch()
                .catch(function () { return Promise.reject(err); }); });
        }
        function printProjectUrl() {
            return execPromise('git remote -v')
                .then(function (stdout) {
                var match = stdout.match(/origin\s+(?:https:\/\/|git@)github\.com(?:\:|\/)([^\/]+)/m);
                var userName = match[1].toLowerCase();
                var url = "https://" + userName + ".github.io/" + (options.userPage ? '' : (baseHref + '/'));
                ui.writeLine(chalk.green("Deployed! Visit " + url));
                ui.writeLine('Github pages might take a few minutes to show the deployed site.');
            });
        }
        function failGracefully(error) {
            if (error && (/git clean/.test(error.message) || /Permission denied/.test(error.message))) {
                ui.writeLine(error.message);
                var msg = 'There was a permissions error during git file operations, ' +
                    'please close any open project files/folders and try again.';
                return Promise.reject(new SilentError(msg.concat(branchErrMsg)));
            }
            else {
                return Promise.reject(error);
            }
        }
    }
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = githubPagesDeployCommand;
var _a;
//# sourceMappingURL=C:/Users/selbype/git/angular-cli-master/packages/angular-cli/commands/github-pages-deploy.js.map