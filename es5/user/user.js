"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userInfoModel = exports.userModel = void 0;
exports.userModel = {
    id: {
        key: true,
        length: 40,
    },
    username: {
        length: 120,
    },
    email: {
        length: 120,
    },
    phone: {
        length: 45,
    },
    dateOfBirth: {
        type: 'datetime'
    },
    interests: {
        type: 'strings'
    },
    links: {},
    imageURL: {},
    coverURL: {},
};
exports.userInfoModel = {
    id: {
        key: true,
        length: 40
    },
    followingcount: {
        type: 'number'
    },
    followercount: {
        type: 'number'
    }
};
//# sourceMappingURL=user.js.map