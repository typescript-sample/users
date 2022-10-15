"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.articleModel = void 0;
exports.articleModel = {
    id: {
        key: true
    },
    name: {
        required: true,
        q: true
    },
    type: {
        match: 'equal',
        required: true
    },
    description: {
        q: true
    },
    content: {
        q: true
    },
    status: {
        match: 'equal'
    },
    tags: {
        type: 'strings',
        match: 'equal'
    },
    imageURL: {}
};
//# sourceMappingURL=article.js.map