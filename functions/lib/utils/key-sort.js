"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.keySort = (params) => {
    return Object.keys(params)
        .sort()
        .reduce((accumulator, currentValue) => {
        // @ts-ignore
        accumulator[currentValue] = params[currentValue];
        return accumulator;
    }, {});
};
//# sourceMappingURL=key-sort.js.map