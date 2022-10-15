"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.musicModel = void 0;
exports.musicModel = {
    id: {
        key: true,
        length: 40
    },
    name: {
        required: true,
        length: 300,
        q: true
    },
    author: {
        type: 'strings',
    },
    releaseDate: {
        type: 'datetime'
    },
    lyric: {},
    imageURL: {
        length: 1500,
    },
    url: {
        length: 1500,
    },
};
//# sourceMappingURL=music.js.map