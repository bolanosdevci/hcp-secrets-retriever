"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mask_entry = exports.validate_entry = void 0;
const validate_entry = (key, value) => {
    if (value === null) {
        throw new Error(`entry: ${key} value is null`);
    }
    if (value === undefined) {
        throw new Error(`entry: ${key} value is undefined`);
    }
    if (value === '') {
        throw new Error(`entry: ${key} value is empty`);
    }
};
exports.validate_entry = validate_entry;
const mask_entry = (value) => {
    if (value.length > 4) {
        const last_chars = value.substr(value.length - 4, value.length);
        return '****' + last_chars;
    }
    return '****';
};
exports.mask_entry = mask_entry;
//# sourceMappingURL=utils.js.map