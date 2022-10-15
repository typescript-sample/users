"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobModel = void 0;
exports.jobModel = {
    id: {
        key: true,
        length: 40,
    },
    title: {
        length: 120
    },
    description: {
        length: 1000
    },
    benefit: {
        length: 1000
    },
    requirements: {
        length: 1000
    },
    publishedAt: {
        type: 'datetime'
    },
    expiredAt: {
        type: 'datetime'
    },
    skill: {
        type: 'primitives'
    },
    quantity: {
        type: 'number'
    },
    applicantCount: {
        type: 'number'
    },
};
//# sourceMappingURL=job.js.map