"use strict";
var Task = require('../ember-cli/lib/models/task');
var opn = require('opn');
exports.DocTask = Task.extend({
    run: function (keyword) {
        var searchUrl = "https://angular.io/docs/ts/latest/api/#!?query=" + keyword;
        return opn(searchUrl, { wait: false });
    }
});
//# sourceMappingURL=C:/Users/selbype/git/angular-cli-master/packages/angular-cli/tasks/doc.js.map