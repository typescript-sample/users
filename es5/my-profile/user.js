"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userModel = exports.achievements = exports.userSettingsModel = exports.fileUploadModel = exports.skillsModel = void 0;
var one_storage_1 = require("one-storage");
exports.skillsModel = {
    skill: {
        required: true,
    },
    hirable: {
        type: 'boolean',
    },
};
exports.fileUploadModel = {
    url: {
        required: true,
    },
    source: {
        required: true,
    },
};
exports.userSettingsModel = {
    userId: {},
    language: {},
    dateFormat: {},
    dateTimeFormat: {},
    timeFormat: {},
    notification: {
        type: 'boolean',
    },
};
exports.achievements = {
    subject: {},
    description: {},
};
exports.userModel = {
    id: {
        key: true,
        match: 'equal',
    },
    username: {},
    email: {
        format: 'email',
        required: true,
        match: 'prefix',
    },
    phone: {
        format: 'phone',
        required: true,
    },
    dateOfBirth: {
        type: 'datetime',
    },
    interests: {
        type: 'primitives',
    },
    skills: {
        type: 'primitives',
        typeof: exports.skillsModel,
    },
    achievements: {
        type: 'primitives',
        typeof: exports.achievements,
    },
    settings: {
        type: 'object',
        typeof: exports.userSettingsModel,
    },
    bio: {},
    coverURL: {},
    imageURL: {},
    gallery: {
        type: 'array',
        typeof: one_storage_1.uploadModel,
    },
    links: {
        type: 'object',
    },
    companies: {},
    educations: {},
    works: {}
};
//# sourceMappingURL=user.js.map