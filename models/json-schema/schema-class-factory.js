"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var error_1 = require('../error');
var serializer_1 = require('./serializer');
var schema_tree_1 = require('./schema-tree');
var InvalidJsonPath = (function (_super) {
    __extends(InvalidJsonPath, _super);
    function InvalidJsonPath() {
        _super.apply(this, arguments);
    }
    return InvalidJsonPath;
}(error_1.NgToolkitError));
exports.InvalidJsonPath = InvalidJsonPath;
// The schema tree node property of the SchemaClass.
var kSchemaNode = Symbol('schema-node');
// The value property of the SchemaClass.
var kOriginalRoot = Symbol('schema-value');
/**
 * Splits a JSON path string into fragments. Fragments can be used to get the value referenced
 * by the path. For example, a path of "a[3].foo.bar[2]" would give you a fragment array of
 * ["a", 3, "foo", "bar", 2].
 * @param path The JSON string to parse.
 * @returns {string[]} The fragments for the string.
 * @private
 */
function _parseJsonPath(path) {
    var fragments = (path || '').split(/\./g);
    var result = [];
    while (fragments.length > 0) {
        var fragment = fragments.shift();
        var match = fragment.match(/([^\[]+)((\[.*\])*)/);
        if (!match) {
            throw new InvalidJsonPath();
        }
        result.push(match[1]);
        if (match[2]) {
            var indices = match[2].slice(1, -1).split('][');
            result.push.apply(result, indices);
        }
    }
    return result.filter(function (fragment) { return !!fragment; });
}
/** Get a SchemaTreeNode from the JSON path string. */
function _getSchemaNodeForPath(rootMetaData, path) {
    var fragments = _parseJsonPath(path);
    // TODO: make this work with union (oneOf) schemas
    return fragments.reduce(function (md, current) {
        return md && md.children && md.children[current];
    }, rootMetaData);
}
var SchemaClassBase = (function () {
    function SchemaClassBase(schema, value) {
        var fallbacks = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            fallbacks[_i - 2] = arguments[_i];
        }
        this[kOriginalRoot] = value;
        var forward = fallbacks.length > 0
            ? (new (SchemaClassBase.bind.apply(SchemaClassBase, [void 0].concat([schema, fallbacks.pop()], fallbacks)))().$$schema())
            : null;
        this[kSchemaNode] = new schema_tree_1.RootSchemaTreeNode(this, {
            forward: forward,
            value: value,
            schema: schema
        });
    }
    SchemaClassBase.prototype.$$root = function () { return this; };
    SchemaClassBase.prototype.$$schema = function () { return this[kSchemaNode]; };
    SchemaClassBase.prototype.$$originalRoot = function () { return this[kOriginalRoot]; };
    /** Sets the value of a destination if the value is currently undefined. */
    SchemaClassBase.prototype.$$alias = function (source, destination) {
        var sourceSchemaTreeNode = _getSchemaNodeForPath(this.$$schema(), source);
        var fragments = _parseJsonPath(destination);
        var maybeValue = fragments.reduce(function (value, current) {
            return value && value[current];
        }, this.$$originalRoot());
        if (maybeValue !== undefined) {
            sourceSchemaTreeNode.set(maybeValue);
            return true;
        }
        return false;
    };
    /** Destroy all links between schemas to allow for GC. */
    SchemaClassBase.prototype.$$dispose = function () {
        this.$$schema().dispose();
    };
    /** Get a value from a JSON path. */
    SchemaClassBase.prototype.$$get = function (path) {
        var node = _getSchemaNodeForPath(this.$$schema(), path);
        return node ? node.get() : undefined;
    };
    /** Set a value from a JSON path. */
    SchemaClassBase.prototype.$$set = function (path, value) {
        var node = _getSchemaNodeForPath(this.$$schema(), path);
        if (node) {
            node.set(value);
        }
        else {
            // This might be inside an object that can have additionalProperties, so
            // a TreeNode would not exist.
            var splitPath = _parseJsonPath(path);
            if (!splitPath) {
                return undefined;
            }
            var parent = splitPath
                .slice(0, -1)
                .reduce(function (parent, curr) { return parent && parent[curr]; }, this);
            if (parent) {
                parent[splitPath[splitPath.length - 1]] = value;
            }
        }
    };
    /** Get the Schema associated with a path. */
    SchemaClassBase.prototype.$$typeOf = function (path) {
        var node = _getSchemaNodeForPath(this.$$schema(), path);
        return node ? node.type : null;
    };
    SchemaClassBase.prototype.$$defined = function (path) {
        var node = _getSchemaNodeForPath(this.$$schema(), path);
        return node ? node.defined : false;
    };
    SchemaClassBase.prototype.$$delete = function (path) {
        var node = _getSchemaNodeForPath(this.$$schema(), path);
        if (node) {
            node.destroy();
        }
    };
    /** Serialize into a string. */
    SchemaClassBase.prototype.$$serialize = function (mimetype) {
        if (mimetype === void 0) { mimetype = 'application/json'; }
        var options = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            options[_i - 1] = arguments[_i];
        }
        var str = '';
        var serializer = serializer_1.Serializer.fromMimetype.apply(serializer_1.Serializer, [mimetype, function (s) { return str += s; }].concat(options));
        serializer.start();
        this.$$schema().serialize(serializer);
        serializer.end();
        return str;
    };
    return SchemaClassBase;
}());
/**
 * Create a class from a JSON SCHEMA object. Instanciating that class with an object
 * allows for extended behaviour.
 * This is the base API to access the Configuration in the CLI.
 * @param schema
 * @returns {GeneratedSchemaClass}
 * @constructor
 */
function SchemaClassFactory(schema) {
    var GeneratedSchemaClass = (function (_super) {
        __extends(GeneratedSchemaClass, _super);
        function GeneratedSchemaClass(value) {
            var fallbacks = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                fallbacks[_i - 1] = arguments[_i];
            }
            _super.apply(this, [schema, value].concat(fallbacks));
        }
        return GeneratedSchemaClass;
    }(SchemaClassBase));
    return GeneratedSchemaClass;
}
exports.SchemaClassFactory = SchemaClassFactory;
//# sourceMappingURL=C:/Users/selbype/git/angular-cli-master/packages/angular-cli/models/json-schema/schema-class-factory.js.map