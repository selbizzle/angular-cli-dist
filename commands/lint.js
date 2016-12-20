"use strict";
var Command = require('../ember-cli/lib/models/command');
var lint_1 = require('../tasks/lint');
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Command.extend({
    name: 'lint',
    description: 'Lints code in existing project',
    works: 'insideProject',
    run: function () {
        var lintTask = new lint_1.default({
            ui: this.ui,
            analytics: this.analytics,
            project: this.project
        });
        return lintTask.run();
    }
});
//# sourceMappingURL=C:/Users/selbype/git/angular-cli-master/packages/angular-cli/commands/lint.js.map