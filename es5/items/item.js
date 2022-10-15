"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.itemModel = void 0;
var one_storage_1 = require("one-storage");
exports.itemModel = {
    id: {
        key: true,
        length: 40
    },
    title: {
        required: true,
        length: 300,
        q: true
    },
    price: {
        type: 'number'
    },
    imageURL: {
        length: 1500,
    },
    brand: {
        length: 255,
    },
    publishedAt: {
        type: 'datetime'
    },
    expiredAt: {
        type: 'datetime'
    },
    status: {
        match: 'equal',
        length: 1
    },
    description: {
        length: 300,
    },
    categories: {
        type: 'strings',
    },
    gallery: {
        type: 'array',
        typeof: one_storage_1.uploadModel,
    },
};
//# sourceMappingURL=item.js.map