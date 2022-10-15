"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentModel = void 0;
exports.commentModel = {
    id: {
        key: true,
        required: true,
        q: true
    },
    author: {
        required: true,
        q: true
    },
    comment: {},
    createdAt: {
        type: 'datetime'
    }
};
//# sourceMappingURL=comment.js.map