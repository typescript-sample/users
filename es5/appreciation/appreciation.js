"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usefulModel = exports.replyModel = exports.appreciationModel = void 0;
exports.appreciationModel = {
    id: {
        key: true,
        match: 'equal',
        required: true,
    },
    author: {
        key: true,
        required: true,
        match: 'equal',
    },
    // title: {
    //   length: 255
    // },
    review: {
        length: 255
    },
    time: {
        type: 'datetime'
    },
    updateAt: {
        type: 'datetime'
    },
    usefulCount: {
        type: 'integer',
        min: 0,
    },
    replyCount: {
        type: 'integer',
        min: 0
    },
    histories: {}
};
exports.replyModel = {
    id: {
        key: true,
        required: true,
        match: 'equal'
    },
    userId: {
        key: true,
        required: true,
        match: 'equal'
    },
    author: {
        key: true,
        required: true,
        match: 'equal'
    },
    title: {
        length: 255
    },
    review: {
        length: 255
    },
    time: {
        type: 'datetime'
    },
    updateAt: {
        type: 'datetime'
    },
};
exports.usefulModel = {
    userId: {
        required: true,
        length: 255,
    },
    appreciationId: {
        required: true,
        length: 255,
    },
    createdAt: {
        type: 'datetime'
    },
    updatedAt: {
        type: 'datetime'
    },
};
//# sourceMappingURL=appreciation.js.map