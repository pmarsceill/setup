"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const resolve = require("resolve");
const isNodeModulePredicate = require("is-builtin-module");
function member(predicateOrComparator) {
    // tslint:disable-next-line
    if (predicateOrComparator.length === 1) {
        const predicate = predicateOrComparator;
        return (imported) => {
            const importMember = imported.defaultMember ||
                imported.namespaceMember ||
                imported.namedMembers[0].alias;
            return predicate(importMember);
        };
    }
    const comparator = predicateOrComparator;
    return (firstImport, secondImport) => {
        const first = firstImport.defaultMember ||
            firstImport.namespaceMember ||
            firstImport.namedMembers[0].alias;
        const second = secondImport.defaultMember ||
            secondImport.namespaceMember ||
            secondImport.namedMembers[0].alias;
        return comparator(first, second);
    };
}
function moduleName(predicateOrComparator) {
    // tslint:disable-next-line
    if (predicateOrComparator.length === 1) {
        const predicate = predicateOrComparator;
        return (imported) => {
            const importMember = imported.moduleName;
            return predicate(importMember);
        };
    }
    const comparator = predicateOrComparator;
    return (firstImport, secondImport) => {
        const first = firstImport.moduleName;
        const second = secondImport.moduleName;
        return comparator(first, second);
    };
}
function name(comparator) {
    return (firstNamedMember, secondNamedMember) => {
        return comparator(firstNamedMember.name, secondNamedMember.name);
    };
}
function alias(comparator) {
    return (firstNamedMember, secondNamedMember) => {
        return comparator(firstNamedMember.alias, secondNamedMember.alias);
    };
}
function always() {
    return true;
}
function not(matcher) {
    return imported => {
        return !matcher(imported);
    };
}
function and(...matchers) {
    return imported => {
        return matchers.every(matcher => matcher(imported));
    };
}
function or(...matchers) {
    return imported => {
        return matchers.some(matcher => matcher(imported));
    };
}
function hasDefaultMember(imported) {
    return !!imported.defaultMember;
}
function hasNamespaceMember(imported) {
    return !!imported.namespaceMember;
}
function hasNamedMembers(imported) {
    return imported.namedMembers.length > 0;
}
function hasMember(imported) {
    return (hasDefaultMember(imported) ||
        hasNamespaceMember(imported) ||
        hasNamedMembers(imported));
}
function hasNoMember(imported) {
    return !hasMember(imported);
}
function hasOnlyDefaultMember(imported) {
    return (hasDefaultMember(imported) &&
        !hasNamespaceMember(imported) &&
        !hasNamedMembers(imported));
}
function hasOnlyNamespaceMember(imported) {
    return (!hasDefaultMember(imported) &&
        hasNamespaceMember(imported) &&
        !hasNamedMembers(imported));
}
function hasOnlyNamedMembers(imported) {
    return (!hasDefaultMember(imported) &&
        !hasNamespaceMember(imported) &&
        hasNamedMembers(imported));
}
function hasMultipleMembers(imported) {
    return (imported.namedMembers.length +
        (imported.defaultMember ? 1 : 0) +
        (imported.namespaceMember ? 1 : 0) >
        1);
}
function hasSingleMember(imported) {
    return (imported.namedMembers.length + (imported.defaultMember ? 1 : 0) === 1 &&
        !hasNamespaceMember(imported));
}
function isNodeModule(imported) {
    return isNodeModulePredicate(imported.moduleName);
}
function isRelativeModule(imported) {
    return imported.moduleName.indexOf(".") === 0;
}
function isAbsoluteModule(imported) {
    return !isRelativeModule(imported);
}
function isInstalledModule(baseFile) {
    return (imported) => {
        try {
            const resolvePath = resolve.sync(imported.moduleName, {
                basedir: path_1.dirname(baseFile),
            });
            return resolvePath.includes("node_modules");
        }
        catch (e) {
            return false;
        }
    };
}
function isScopedModule(imported) {
    return imported.moduleName.startsWith("@");
}
function startsWithUpperCase(text) {
    const start = text.charAt(0);
    return text.charAt(0) === start.toUpperCase();
}
function startsWithLowerCase(text) {
    const start = text.charAt(0);
    return text.charAt(0) === start.toLowerCase();
}
function startsWithAlphanumeric(text) {
    return !!text.match(/^[A-Za-z0-9]/);
}
function startsWith(...prefixes) {
    return text => {
        return prefixes.some(prefix => text.startsWith(prefix));
    };
}
function naturally(first, second) {
    return first.localeCompare(second, "en");
}
function unicode(first, second) {
    if (first < second) {
        return -1;
    }
    if (first > second) {
        return 1;
    }
    return 0;
}
function dotSegmentCount(firstImport, secondImport) {
    const regex = /\.+(?=\/)/g;
    const firstCount = (firstImport.moduleName.match(regex) || []).join("")
        .length;
    const secondCount = (secondImport.moduleName.match(regex) || []).join("")
        .length;
    if (firstCount > secondCount) {
        return -1;
    }
    if (firstCount < secondCount) {
        return 1;
    }
    return 0;
}
const StyleAPI = {
    member,
    moduleName,
    name,
    alias,
    always,
    not,
    and,
    or,
    hasMember,
    hasNoMember,
    hasNamespaceMember,
    hasDefaultMember,
    hasNamedMembers,
    hasOnlyDefaultMember,
    hasOnlyNamespaceMember,
    hasOnlyNamedMembers,
    hasMultipleMembers,
    hasSingleMember,
    isNodeModule,
    isRelativeModule,
    isAbsoluteModule,
    isScopedModule,
    isInstalledModule,
    startsWithUpperCase,
    startsWithLowerCase,
    startsWithAlphanumeric,
    startsWith,
    naturally,
    unicode,
    dotSegmentCount,
};
exports.default = StyleAPI;
