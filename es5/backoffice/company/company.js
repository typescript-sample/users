"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.companyModel = void 0;
var one_storage_1 = require("one-storage");
exports.companyModel = {
    id: {
        key: true,
        match: 'equal',
    },
    name: {
        length: 120,
    },
    description: {
        length: 1000,
    },
    size: {
        type: 'number',
    },
    address: {
        length: 255,
    },
    status: {
        match: 'equal',
        length: 1,
    },
    establishedAt: {
        type: 'datetime',
    },
    categories: {
        type: 'strings',
    },
    gallery: {
        type: 'array',
        typeof: one_storage_1.uploadModel,
    },
    coverURL: {},
    imageURL: {},
};
//# sourceMappingURL=company.js.map