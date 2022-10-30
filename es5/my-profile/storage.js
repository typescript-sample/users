"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenericSearchStorageService = exports.GenericStorageService = exports.uploadModel = exports.getFileExtension = exports.appendFileExtension = exports.removeFileExtension = exports.StorageService = exports.buildStorageConfig = exports.buildConfig = void 0;
function buildConfig(m) {
    if (m) {
        var c = {};
        c.id = m.id && m.id.length > 0 ? m.id : 'id';
        c.image = m.image && m.image.length > 0 ? m.image : 'imageURL';
        c.cover = m.cover && m.cover.length > 0 ? m.cover : 'coverURL';
        c.gallery = m.gallery && m.gallery.length > 0 ? m.gallery : 'gallery';
        return c;
    }
    else {
        return {
            id: 'id',
            image: 'imageURL',
            cover: 'coverURL',
            gallery: 'gallery',
        };
    }
}
exports.buildConfig = buildConfig;
function buildStorageConfig(m) {
    if (m) {
        var c = {};
        c.image = m.image && m.image.length > 0 ? m.image : 'image';
        c.cover = m.cover && m.cover.length > 0 ? m.cover : 'cover';
        c.gallery = m.gallery && m.gallery.length > 0 ? m.gallery : 'gallery';
        return c;
    }
    else {
        return {
            image: 'image',
            cover: 'cover',
            gallery: 'gallery',
        };
    }
}
exports.buildStorageConfig = buildStorageConfig;
var StorageService = /** @class */ (function () {
    function StorageService(loadData, patchData, storage, deleteFile, generateId, buildUrl, sizesCover, sizesImage, config, model) {
        this.loadData = loadData;
        this.patchData = patchData;
        this.storage = storage;
        this.deleteFile = deleteFile;
        this.generateId = generateId;
        this.buildUrl = buildUrl;
        this.sizesCover = sizesCover;
        this.sizesImage = sizesImage;
        this.model = buildConfig(model);
        this.config = buildStorageConfig(config);
        this.uploadCoverImage = this.uploadCoverImage.bind(this);
        this.uploadGalleryFile = this.uploadGalleryFile.bind(this);
        this.updateGallery = this.updateGallery.bind(this);
        this.deleteGalleryFile = this.deleteGalleryFile.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
        this.addExternalResource = this.addExternalResource.bind(this);
        this.deleteExternalResource = this.deleteExternalResource.bind(this);
        this.getGallery = this.getGallery.bind(this);
    }
    StorageService.prototype.getGallery = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.loadData(id).then(function (user) {
                        if (user) {
                            return user[_this.model.gallery];
                        }
                        return [];
                    })];
            });
        });
    };
    StorageService.prototype.uploadCoverImage = function (id, data, sizes) {
        return __awaiter(this, void 0, void 0, function () {
            var user, urlUploaded, oldUrl, galary, _a, _b, _c, index, file, urlOrigin, obj, res, e_1_1;
            var e_1, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, this.loadData(id)];
                    case 1:
                        user = _e.sent();
                        if (!user) {
                            return [2 /*return*/, ''];
                        }
                        urlUploaded = '';
                        oldUrl = user[this.model.cover];
                        galary = user[this.model.gallery];
                        // if (oldUrl && galary?.length && galary?.length > 0)
                        return [4 /*yield*/, this.deleteFileUpload(oldUrl, galary, sizes !== null && sizes !== void 0 ? sizes : this.sizesCover)];
                    case 2:
                        // if (oldUrl && galary?.length && galary?.length > 0)
                        _e.sent();
                        _e.label = 3;
                    case 3:
                        _e.trys.push([3, 9, 10, 11]);
                        _a = __values(data.entries()), _b = _a.next();
                        _e.label = 4;
                    case 4:
                        if (!!_b.done) return [3 /*break*/, 8];
                        _c = __read(_b.value, 2), index = _c[0], file = _c[1];
                        return [4 /*yield*/, this.storage.upload(file.data, file.name, this.config.cover)];
                    case 5:
                        urlOrigin = _e.sent();
                        obj = {};
                        if (!(index === 0)) return [3 /*break*/, 7];
                        obj[this.model.id] = id;
                        obj[this.model.cover] = urlOrigin;
                        urlUploaded = urlOrigin;
                        return [4 /*yield*/, this.patchData(obj)];
                    case 6:
                        res = _e.sent();
                        if (res < 1) {
                            return [2 /*return*/, ''];
                        }
                        _e.label = 7;
                    case 7:
                        _b = _a.next();
                        return [3 /*break*/, 4];
                    case 8: return [3 /*break*/, 11];
                    case 9:
                        e_1_1 = _e.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 11];
                    case 10:
                        try {
                            if (_b && !_b.done && (_d = _a.return)) _d.call(_a);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 11: return [2 /*return*/, urlUploaded];
                }
            });
        });
    };
    StorageService.prototype.uploadImage = function (id, data, sizes) {
        return __awaiter(this, void 0, void 0, function () {
            var user, urlUploaded, oldUrl, galary, _a, _b, _c, index, file, urlOrigin, obj, res, e_2_1;
            var e_2, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, this.loadData(id)];
                    case 1:
                        user = _e.sent();
                        if (!user) {
                            return [2 /*return*/, ''];
                        }
                        urlUploaded = '';
                        oldUrl = user[this.model.image];
                        galary = user[this.model.gallery];
                        return [4 /*yield*/, this.deleteFileUpload(oldUrl, galary, sizes !== null && sizes !== void 0 ? sizes : this.sizesImage)];
                    case 2:
                        _e.sent();
                        _e.label = 3;
                    case 3:
                        _e.trys.push([3, 9, 10, 11]);
                        _a = __values(data.entries()), _b = _a.next();
                        _e.label = 4;
                    case 4:
                        if (!!_b.done) return [3 /*break*/, 8];
                        _c = __read(_b.value, 2), index = _c[0], file = _c[1];
                        return [4 /*yield*/, this.storage.upload(file.data, file.name, this.config.image)];
                    case 5:
                        urlOrigin = _e.sent();
                        obj = {};
                        if (!(index === 0)) return [3 /*break*/, 7];
                        obj[this.model.id] = id;
                        obj[this.model.image] = urlOrigin;
                        urlUploaded = urlOrigin;
                        return [4 /*yield*/, this.patchData(obj)];
                    case 6:
                        res = _e.sent();
                        if (res < 1) {
                            return [2 /*return*/, ''];
                        }
                        _e.label = 7;
                    case 7:
                        _b = _a.next();
                        return [3 /*break*/, 4];
                    case 8: return [3 /*break*/, 11];
                    case 9:
                        e_2_1 = _e.sent();
                        e_2 = { error: e_2_1 };
                        return [3 /*break*/, 11];
                    case 10:
                        try {
                            if (_b && !_b.done && (_d = _a.return)) _d.call(_a);
                        }
                        finally { if (e_2) throw e_2.error; }
                        return [7 /*endfinally*/];
                    case 11: return [2 /*return*/, urlUploaded];
                }
            });
        });
    };
    StorageService.prototype.deleteFileUpload = function (oldUrl, galary, sizes) {
        return __awaiter(this, void 0, void 0, function () {
            var sizes_1, sizes_1_1, size, oldSizeURL, e_3_1;
            var e_3, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        // delete original file
                        if (!oldUrl || oldUrl.length > 0) {
                            return [2 /*return*/];
                        }
                        if (!shouldDelete(oldUrl, galary)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.deleteFile(this.storage.delete, oldUrl).catch(function (err) { })];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2:
                        if (!sizes) {
                            return [2 /*return*/];
                        }
                        _b.label = 3;
                    case 3:
                        _b.trys.push([3, 8, 9, 10]);
                        sizes_1 = __values(sizes), sizes_1_1 = sizes_1.next();
                        _b.label = 4;
                    case 4:
                        if (!!sizes_1_1.done) return [3 /*break*/, 7];
                        size = sizes_1_1.value;
                        oldSizeURL = removeFileExtension(oldUrl) + '_' + size + '.' + getFileExtension(oldUrl);
                        if (!(oldSizeURL && oldSizeURL.length > 0)) return [3 /*break*/, 6];
                        if (!shouldDelete(oldSizeURL, galary)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.deleteFile(this.storage.delete, oldSizeURL).catch(function (err) { })];
                    case 5:
                        _b.sent();
                        _b.label = 6;
                    case 6:
                        sizes_1_1 = sizes_1.next();
                        return [3 /*break*/, 4];
                    case 7: return [3 /*break*/, 10];
                    case 8:
                        e_3_1 = _b.sent();
                        e_3 = { error: e_3_1 };
                        return [3 /*break*/, 10];
                    case 9:
                        try {
                            if (sizes_1_1 && !sizes_1_1.done && (_a = sizes_1.return)) _a.call(sizes_1);
                        }
                        finally { if (e_3) throw e_3.error; }
                        return [7 /*endfinally*/];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    StorageService.prototype.uploadGalleryFile = function (_a) {
        var id = _a.id, source = _a.source, name = _a.name, type = _a.type, data = _a.data;
        return __awaiter(this, void 0, void 0, function () {
            var user, fileName, newUrl, oldGalary, url, galary, obj, res;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.loadData(id)];
                    case 1:
                        user = _b.sent();
                        if (!user) {
                            return [2 /*return*/, []];
                        }
                        fileName = name;
                        newUrl = this.buildUrl(fileName, this.config.gallery);
                        oldGalary = user[this.model.gallery];
                        if (checkDuplicateFile(oldGalary || [], newUrl)) {
                            fileName = appendFileExtension(removeFileExtension(name) + '_' + this.generateId(), getFileExtension(name));
                        }
                        return [4 /*yield*/, this.storage.upload(data, fileName, this.config.gallery)];
                    case 2:
                        url = _b.sent();
                        galary = oldGalary ? oldGalary : [];
                        galary.push({ source: source, url: url, type: type });
                        obj = {};
                        obj[this.model.id] = id;
                        obj[this.model.gallery] = galary;
                        return [4 /*yield*/, this.patchData(obj)];
                    case 3:
                        res = _b.sent();
                        return [2 /*return*/, res >= 1 ? galary : []];
                }
            });
        });
    };
    StorageService.prototype.updateGallery = function (id, data) {
        return __awaiter(this, void 0, void 0, function () {
            var user, obj, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadData(id)];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            return [2 /*return*/, false];
                        }
                        obj = {};
                        obj[this.model.id] = id;
                        obj[this.model.gallery] = data;
                        return [4 /*yield*/, this.patchData(obj)];
                    case 2:
                        res = _a.sent();
                        return [2 /*return*/, res >= 1 ? true : false];
                }
            });
        });
    };
    StorageService.prototype.deleteGalleryFile = function (id, url) {
        return __awaiter(this, void 0, void 0, function () {
            var user, oldUrl, oldCoverUrl, oldGalary, gallery, obj, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadData(id)];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            return [2 /*return*/, false];
                        }
                        oldUrl = user[this.model.image];
                        oldCoverUrl = user[this.model.cover];
                        oldGalary = user[this.model.gallery];
                        if (!(url !== oldUrl && url !== oldCoverUrl)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.deleteFile(this.storage.delete, url)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        gallery = oldGalary === null || oldGalary === void 0 ? void 0 : oldGalary.filter(function (file) { return file.url !== url; });
                        obj = {};
                        obj[this.model.id] = id;
                        obj[this.model.gallery] = gallery;
                        return [4 /*yield*/, this.patchData(obj)];
                    case 4:
                        res = _a.sent();
                        return [2 /*return*/, res >= 1 ? true : false];
                }
            });
        });
    };
    StorageService.prototype.addExternalResource = function (id, data) {
        return __awaiter(this, void 0, void 0, function () {
            var user, gallery, rs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadData(id)];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            return [2 /*return*/, false];
                        }
                        gallery = user[this.model.gallery];
                        gallery = gallery ? gallery : [];
                        gallery.push(data);
                        user[this.model.gallery] = gallery;
                        return [4 /*yield*/, this.patchData(user)];
                    case 2:
                        rs = _a.sent();
                        return [2 /*return*/, rs >= 1 ? true : false];
                }
            });
        });
    };
    StorageService.prototype.deleteExternalResource = function (id, url) {
        return __awaiter(this, void 0, void 0, function () {
            var user, rs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadData(id)];
                    case 1:
                        user = _a.sent();
                        user[this.model.gallery] = user[this.model.gallery].filter(function (file) { return file.url !== url; });
                        return [4 /*yield*/, this.patchData(user)];
                    case 2:
                        rs = _a.sent();
                        return [2 /*return*/, rs >= 1 ? true : false];
                }
            });
        });
    };
    return StorageService;
}());
exports.StorageService = StorageService;
function removeFileExtension(name) {
    var idx = name.lastIndexOf('.');
    return idx >= 0 ? name.substring(0, idx) : name;
}
exports.removeFileExtension = removeFileExtension;
function appendFileExtension(s, ext) {
    return ext.length > 0 ? s + '.' + ext : s;
}
exports.appendFileExtension = appendFileExtension;
function getFileExtension(name) {
    var idx = name.lastIndexOf('.');
    return idx >= 0 ? name.substring(idx + 1) : '';
}
exports.getFileExtension = getFileExtension;
exports.uploadModel = {
    type: {},
    url: {
        required: true,
    },
    source: {},
};
// tslint:disable-next-line:max-classes-per-file
var GenericStorageService = /** @class */ (function (_super) {
    __extends(GenericStorageService, _super);
    function GenericStorageService(repository, storage, deleteFile, generateId, buildUrl, sizesCover, sizesImage, config, model) {
        var _this = _super.call(this, repository.load, repository.patch, storage, deleteFile, generateId, buildUrl, sizesCover, sizesImage, config, model) || this;
        _this.repository = repository;
        _this.metadata = _this.metadata.bind(_this);
        _this.keys = _this.keys.bind(_this);
        _this.load = _this.load.bind(_this);
        _this.insert = _this.insert.bind(_this);
        _this.update = _this.update.bind(_this);
        _this.patch = _this.patch.bind(_this);
        _this.delete = _this.delete.bind(_this);
        return _this;
    }
    GenericStorageService.prototype.metadata = function () {
        return this.repository.metadata ? this.repository.metadata() : undefined;
    };
    GenericStorageService.prototype.keys = function () {
        return this.repository.keys ? this.repository.keys() : [];
    };
    GenericStorageService.prototype.load = function (id, ctx) {
        return this.repository.load(id, ctx);
    };
    GenericStorageService.prototype.insert = function (obj, ctx) {
        return this.repository.insert(obj, ctx);
    };
    GenericStorageService.prototype.update = function (obj, ctx) {
        return this.repository.update(obj, ctx);
    };
    GenericStorageService.prototype.patch = function (obj, ctx) {
        return this.repository.patch
            ? this.repository.patch(obj, ctx)
            : Promise.resolve(-1);
    };
    GenericStorageService.prototype.delete = function (id, ctx) {
        return this.repository.delete
            ? this.repository.delete(id, ctx)
            : Promise.resolve(-1);
    };
    return GenericStorageService;
}(StorageService));
exports.GenericStorageService = GenericStorageService;
// tslint:disable-next-line:max-classes-per-file
var GenericSearchStorageService = /** @class */ (function (_super) {
    __extends(GenericSearchStorageService, _super);
    function GenericSearchStorageService(find, repo, storage, deleteFile, generateId, buildUrl, sizesCover, sizesImage, config, model) {
        var _this = _super.call(this, repo, storage, deleteFile, generateId, buildUrl, sizesCover, sizesImage, config, model) || this;
        _this.find = find;
        _this.search = _this.search.bind(_this);
        return _this;
    }
    GenericSearchStorageService.prototype.search = function (s, limit, offset, fields) {
        return this.find(s, limit, offset, fields);
    };
    return GenericSearchStorageService;
}(GenericStorageService));
exports.GenericSearchStorageService = GenericSearchStorageService;
function checkDuplicateFile(data, url) {
    var rs = data.find(function (upload) { return upload.url === url; });
    return rs ? true : false;
}
function shouldDelete(url, files) {
    var e_4, _a;
    if (!files || files.length === 0) {
        return true;
    }
    try {
        for (var files_1 = __values(files), files_1_1 = files_1.next(); !files_1_1.done; files_1_1 = files_1.next()) {
            var file = files_1_1.value;
            if (url === file.url) {
                return false;
            }
        }
    }
    catch (e_4_1) { e_4 = { error: e_4_1 }; }
    finally {
        try {
            if (files_1_1 && !files_1_1.done && (_a = files_1.return)) _a.call(files_1);
        }
        finally { if (e_4) throw e_4.error; }
    }
    return true;
}
//# sourceMappingURL=storage.js.map