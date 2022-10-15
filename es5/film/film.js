"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filmModel = void 0;
var one_storage_1 = require("one-storage");
exports.filmModel = {
    id: {
        key: true,
        length: 40
    },
    title: {
        required: true,
        length: 300,
        q: true
    },
    description: {
        length: 300,
    },
    imageURL: {
        length: 300
    },
    trailerUrl: {
        length: 300
    },
    categories: {
        type: 'strings',
    },
    status: {
        match: 'equal',
        length: 1
    },
    directors: {
        type: 'strings',
    },
    casts: {
        type: 'strings',
    },
    productions: {
        type: 'strings',
    },
    countries: {
        type: 'strings',
    },
    language: {
        type: 'string'
    },
    writer: {
        type: 'strings'
    },
    createdBy: {},
    createdAt: {
        type: 'datetime'
    },
    updatedBy: {},
    updatedAt: {
        type: 'datetime'
    },
    gallery: {
        type: 'array',
        typeof: one_storage_1.uploadModel,
    },
    coverURL: {},
};
//# sourceMappingURL=film.js.map