"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isScopedModule(imported) {
    return imported.moduleName[0] === '@';
}
function default_1(styleApi) {
    const { and, not, alias, dotSegmentCount, unicode, moduleName, isNodeModule, isAbsoluteModule, isRelativeModule, hasNoMember, } = styleApi;
    return [
        // import 'foo';
        // import './foo';
        { match: hasNoMember },
        { separator: true },
        // import ... from 'fs';
        {
            match: isNodeModule,
            sort: moduleName(unicode),
            sortNamedMembers: alias(unicode),
        },
        // import ... from 'foo';
        {
            match: and(isAbsoluteModule, not(isScopedModule)),
            sort: moduleName(unicode),
            sortNamedMembers: alias(unicode),
        },
        // import … from "foo";
        {
            match: isScopedModule,
            sort: moduleName(unicode),
            sortNamedMembers: alias(unicode),
        },
        // import ... from '../foo';
        // import ... from './foo';
        {
            match: isRelativeModule,
            sort: [dotSegmentCount, moduleName(unicode)],
            sortNamedMembers: alias(unicode)
        },
    ];
}
exports.default = default_1;
