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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMyItemUploadController = exports.useMyItemController = exports.MyItemController = exports.useMyItemService = exports.ItemManager = void 0;
var express_ext_1 = require("express-ext");
var one_storage_1 = require("one-storage");
var query_core_1 = require("query-core");
var query_mappers_1 = require("query-mappers");
var upload_express_1 = require("upload-express");
var item_1 = require("./item");
__exportStar(require("./item"), exports);
var ItemManager = /** @class */ (function (_super) {
    __extends(ItemManager, _super);
    function ItemManager(search, repository, storage, save, deleteFile, generateId, buildUrl, sizesCover, sizesImage, config, model) {
        var _this = _super.call(this, search, repository, storage, deleteFile, generateId, buildUrl, sizesCover, sizesImage, config, model) || this;
        _this.save = save;
        _this.uploadCoverImage = _this.uploadCoverImage.bind(_this);
        _this.uploadGalleryFile = _this.uploadGalleryFile.bind(_this);
        _this.updateGallery = _this.updateGallery.bind(_this);
        _this.deleteGalleryFile = _this.deleteGalleryFile.bind(_this);
        _this.uploadImage = _this.uploadImage.bind(_this);
        _this.getGalllery = _this.getGalllery.bind(_this);
        return _this;
    }
    ItemManager.prototype.getGalllery = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.repository.load(id).then(function (item) {
                        if (item) {
                            return item[_this.model.gallery];
                        }
                        return [];
                    })];
            });
        });
    };
    ItemManager.prototype.insert = function (item, ctx) {
        if (item.brand && item.brand.length > 0) {
            this.save([item.brand]);
        }
        return this.repository.insert(item, ctx);
    };
    ItemManager.prototype.update = function (item, ctx) {
        if (item.brand && item.brand.length > 0) {
            this.save([item.brand]);
        }
        return this.repository.update(item, ctx);
    };
    ItemManager.prototype.patch = function (item, ctx) {
        if (item.brand && item.brand.length > 0) {
            this.save([item.brand]);
        }
        return (this.repository.patch ? this.repository.patch(item, ctx) : Promise.resolve(-1));
    };
    return ItemManager;
}(one_storage_1.GenericSearchStorageService));
exports.ItemManager = ItemManager;
function useMyItemService(db, storage, save, deleteFile, generateId, buildUrl, sizesCover, sizesImage, config, model, mapper) {
    var queryItems = (0, query_mappers_1.useQuery)('item', mapper, item_1.itemModel, true);
    var builder = new query_core_1.SearchBuilder(db.query, 'item', item_1.itemModel, query_core_1.postgres, queryItems);
    var repository = new query_core_1.Repository(db, 'item', item_1.itemModel);
    return new ItemManager(builder.search, repository, storage, save, deleteFile, generateId, buildUrl, sizesCover, sizesImage, config, model);
}
exports.useMyItemService = useMyItemService;
var MyItemController = /** @class */ (function (_super) {
    __extends(MyItemController, _super);
    function MyItemController(log, itemService) {
        return _super.call(this, log, itemService) || this;
    }
    return MyItemController;
}(express_ext_1.Controller));
exports.MyItemController = MyItemController;
function useMyItemController(log, db, storage, save, deleteFile, generateId, buildUrl, sizesCover, sizesImage, config, model, mapper) {
    return new MyItemController(log, useMyItemService(db, storage, save, deleteFile, generateId, buildUrl, sizesCover, sizesImage, config, model, mapper));
}
exports.useMyItemController = useMyItemController;
function useMyItemUploadController(log, db, storage, save, deleteFile, generateId, buildUrl, sizesCover, sizesImage, config, model, mapper) {
    var service = useMyItemService(db, storage, save, deleteFile, generateId, buildUrl, sizesCover, sizesImage, config, model, mapper);
    return new upload_express_1.UploadController(log, service, service.getGalllery, generateId, sizesCover, sizesImage);
}
exports.useMyItemUploadController = useMyItemUploadController;
//# sourceMappingURL=index.js.map