"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cinemaModel = void 0;
var one_storage_1 = require("one-storage");
exports.cinemaModel = {
    id: {
        key: true,
        length: 40,
        match: 'equal',
    },
    name: {
        length: 255,
    },
    address: {
        length: 255,
    },
    parent: {
        length: 40,
    },
    status: {
        length: 1,
    },
    latitude: {
        length: 255,
    },
    longitude: {
        length: 255,
    },
    imageURL: {},
    createdBy: {},
    createdAt: {
        column: 'createdat',
        type: 'datetime',
    },
    updatedBy: {},
    updatedAt: {
        column: 'createdat',
        type: 'datetime',
    },
    gallery: {
        type: 'array',
        typeof: one_storage_1.uploadModel,
    },
    coverURL: {},
};
//# sourceMappingURL=cinema.js.map