"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reservationModel = exports.roomModel = exports.fileUploadImageModel = void 0;
exports.fileUploadImageModel = {
    type: {},
    url: {},
    source: {},
};
exports.roomModel = {
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
    price: {
        type: 'number'
    },
    offer: {
        type: 'strings'
    },
    location: {
        length: 255
    },
    host: {
        length: 255
    },
    guest: {
        type: 'number'
    },
    bedrooms: {
        type: 'number'
    },
    bed: {
        type: 'number'
    },
    bathrooms: {
        type: 'number'
    },
    highlight: {
        type: 'strings'
    },
    status: {
        type: 'string'
    },
    category: {
        type: 'strings'
    },
    region: {
        type: 'string'
    },
    typeof: {
        type: 'strings'
    },
    property: {
        type: 'string'
    },
    language: {
        type: 'strings'
    },
    imageUrl: {
        type: 'array',
        typeof: exports.fileUploadImageModel,
    },
};
exports.reservationModel = {
    id: {
        key: true,
        length: 40,
    },
    startdate: {
        type: 'datetime'
    },
    enddate: {
        type: 'datetime'
    },
    guestid: {
        length: 250
    },
    totalprice: {
        type: 'number'
    },
    roomid: {
        length: 250
    }
};
//# sourceMappingURL=room.js.map