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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyProfileUploadManager = exports.MyProfileManager = exports.useMyProfileUploadController = exports.useMyProfileController = exports.MyProfileController = void 0;
var storage_1 = require("./storage");
var reflectx_1 = require("reflectx");
var user_controller_1 = require("./user-controller");
Object.defineProperty(exports, "MyProfileController", { enumerable: true, get: function () { return user_controller_1.MyProfileController; } });
var upload_1 = require("./upload");
__exportStar(require("./user"), exports);
function useMyProfileController(log, repository, settings, saveSkills, saveInterests, saveLookingFor, saveEducation, saveCompany) {
    var service = new MyProfileManager(repository, settings);
    return new user_controller_1.MyProfileController(log, service, saveSkills, saveInterests, saveLookingFor, saveEducation, saveCompany);
}
exports.useMyProfileController = useMyProfileController;
function useMyProfileUploadController(log, repository, storage, deleteFile, generateId, buildUrl, sizesCover, sizesImage, config, model) {
    var service = new storage_1.StorageService(repository.load, repository.patch, storage, deleteFile, generateId, buildUrl, sizesCover, sizesImage, config, model);
    return new upload_1.UploadController(log, service, generateId, sizesCover, sizesImage);
}
exports.useMyProfileUploadController = useMyProfileUploadController;
var MyProfileManager = /** @class */ (function () {
    function MyProfileManager(repository, settings) {
        this.repository = repository;
        this.settings = settings;
    }
    MyProfileManager.prototype.getMyProfile = function (id) {
        return this.repository.load(id).then(function (user) {
            var rs = null;
            if (user) {
                delete user.settings;
                rs = user;
            }
            return rs;
        });
    };
    MyProfileManager.prototype.getMySettings = function (id) {
        var _this = this;
        return this.repository.load(id)
            .then(function (user) {
            return user && user.settings ? user.settings : (0, reflectx_1.clone)(_this.settings);
        });
    };
    MyProfileManager.prototype.saveMyProfile = function (user) {
        return this.repository.patch(user);
    };
    MyProfileManager.prototype.saveMySettings = function (id, settings) {
        return this.repository.patch({ id: id, settings: settings });
    };
    return MyProfileManager;
}());
exports.MyProfileManager = MyProfileManager;
var MyProfileUploadManager = /** @class */ (function (_super) {
    __extends(MyProfileUploadManager, _super);
    function MyProfileUploadManager(repository, settings, storage, deleteFile, generateId, buildUrl, sizesCover, sizesImage, config, model) {
        var _this = _super.call(this, repository.load, repository.patch, storage, deleteFile, generateId, buildUrl, sizesCover, sizesImage, config, model) || this;
        _this.repository = repository;
        _this.settings = settings;
        _this.uploadCoverImage = _this.uploadCoverImage.bind(_this);
        _this.uploadGalleryFile = _this.uploadGalleryFile.bind(_this);
        _this.updateGallery = _this.updateGallery.bind(_this);
        _this.deleteGalleryFile = _this.deleteGalleryFile.bind(_this);
        _this.uploadImage = _this.uploadImage.bind(_this);
        _this.getGalllery = _this.getGalllery.bind(_this);
        return _this;
    }
    MyProfileUploadManager.prototype.getMyProfile = function (id) {
        return this.repository.load(id).then(function (user) {
            var rs = null;
            if (user) {
                delete user.settings;
                rs = user;
            }
            return rs;
        });
    };
    MyProfileUploadManager.prototype.getMySettings = function (id) {
        var _this = this;
        return this.repository.load(id)
            .then(function (user) {
            return user && user.settings ? user.settings : (0, reflectx_1.clone)(_this.settings);
        });
    };
    MyProfileUploadManager.prototype.saveMyProfile = function (user) {
        return this.repository.patch(user);
    };
    MyProfileUploadManager.prototype.saveMySettings = function (id, settings) {
        return this.repository.patch({ id: id, settings: settings });
    };
    MyProfileUploadManager.prototype.getGalllery = function (id) {
        var _this = this;
        return this.repository.load(id).then(function (user) {
            if (user) {
                return user[_this.model.gallery];
            }
            return [];
        });
    };
    return MyProfileUploadManager;
}(storage_1.StorageService));
exports.MyProfileUploadManager = MyProfileUploadManager;
//# sourceMappingURL=index.js.map