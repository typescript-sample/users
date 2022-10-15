"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateCriteriaModel = exports.rateFullInfoModel = exports.companyModel = void 0;
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
    imageURL: {},
    coverURL: {},
    gallery: {
        type: 'array',
        typeof: one_storage_1.uploadModel,
    },
};
exports.rateFullInfoModel = {
    id: {
        key: true
    },
    rate: {
        type: 'number',
    },
    count: {
        type: 'integer',
    },
    score: {
        type: 'number',
    },
    rate1: {
        type: 'number',
    },
    rate2: {
        type: 'number',
    },
    rate3: {
        type: 'number',
    },
    rate4: {
        type: 'number',
    },
    rate5: {
        type: 'number',
    }
};
exports.rateCriteriaModel = {
    id: {
        key: true,
        match: 'equal'
    },
    author: {
        key: true,
        match: 'equal'
    },
    rate: {
        type: 'number'
    },
    rates: {
        type: 'integers'
    },
    time: {
        type: 'datetime'
    },
    review: {},
    gallery: {
        type: 'array',
        typeof: one_storage_1.uploadModel,
    },
    coverURL: {},
    iamgeURL: {},
};
//# sourceMappingURL=company.js.map