"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.infoModel = exports.responseModel = void 0;
exports.responseModel = {
    id: {
        key: true,
        required: true,
        match: 'equal',
    },
    author: {
        key: true,
        required: true,
        match: 'equal',
    },
    description: {},
    time: {
        type: 'datetime',
    },
    review: {
        q: true,
    },
    usefulCount: {
        type: 'integer',
        min: 0,
    },
    replyCount: {
        type: 'integer',
        min: 0,
    },
};
exports.infoModel = {
    id: {
        key: true,
    },
    viewCount: {
        type: 'number',
    },
};
//# sourceMappingURL=response.js.map