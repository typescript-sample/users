"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.locationModel = void 0;
var one_storage_1 = require("one-storage");
exports.locationModel = {
    id: {
        key: true,
        length: 40,
    },
    name: {
        required: true,
        q: true,
    },
    type: {
        match: 'equal',
        required: true,
    },
    description: {
        q: true,
    },
    status: {
        match: 'equal',
        length: 1,
    },
    latitude: {
        type: 'number',
    },
    longitude: {
        type: 'number',
    },
    imageURL: {},
    coverURL: {},
    gallery: {
        type: 'array',
        typeof: one_storage_1.uploadModel,
    },
};
//# sourceMappingURL=location.js.map