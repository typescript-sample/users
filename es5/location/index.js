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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLocationUploadController = exports.useLocationInfomationController = exports.LocationInfomationService = exports.useSavedLocationController = exports.useLocationFollowController = exports.generate = exports.useLocationRateCommentController = exports.useLocationRateCommentService = exports.useLocationReactionController = exports.useLocationReactionService = exports.useLocationRateController = exports.useLocationController = exports.LocationInfomationController = exports.LocationController = exports.LocationUploadService = exports.LocationService = void 0;
var express_ext_1 = require("express-ext");
var express_ext_2 = require("express-ext");
var express_ext_3 = require("express-ext");
var one_storage_1 = require("one-storage");
var onecore_1 = require("onecore");
var pg_extension_1 = require("pg-extension");
var query_core_1 = require("query-core");
var query_mappers_1 = require("query-mappers");
var rate_core_1 = require("rate-core");
var rate_query_1 = require("rate-query");
var review_reaction_1 = require("review-reaction");
var review_reaction_express_1 = require("review-reaction-express");
var review_reaction_query_1 = require("review-reaction-query");
var review_reaction_query_2 = require("review-reaction-query");
var shortid_1 = __importDefault(require("shortid"));
var upload_express_1 = require("upload-express");
var xvalidators_1 = require("xvalidators");
var location_1 = require("./location");
var location_2 = require("./location");
var LocationService = /** @class */ (function (_super) {
    __extends(LocationService, _super);
    function LocationService(search, repository, infoRepository) {
        var _this = _super.call(this, search, repository) || this;
        _this.repository = repository;
        _this.infoRepository = infoRepository;
        return _this;
    }
    LocationService.prototype.load = function (id) {
        var _this = this;
        return this.repository.load(id).then(function (location) {
            if (!location) {
                return null;
            }
            else {
                return _this.infoRepository.load(id).then(function (info) {
                    if (info) {
                        delete info['id'];
                        delete info['count'];
                        delete info['score'];
                        location.info = info;
                    }
                    return location;
                });
            }
        });
    };
    return LocationService;
}(onecore_1.ViewSearchManager));
exports.LocationService = LocationService;
var LocationUploadService = /** @class */ (function (_super) {
    __extends(LocationUploadService, _super);
    function LocationUploadService(search, repository, storage, deleteFile, generateId, buildUrl, sizesCover, sizesImage, config, model) {
        return _super.call(this, search, repository, storage, deleteFile, generateId, buildUrl, sizesCover, sizesImage, config, model) || this;
    }
    LocationUploadService.prototype.getGalllery = function (id) {
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
    return LocationUploadService;
}(one_storage_1.GenericSearchStorageService));
exports.LocationUploadService = LocationUploadService;
var LocationController = /** @class */ (function (_super) {
    __extends(LocationController, _super);
    function LocationController(log, locationService) {
        var _this = _super.call(this, log, locationService) || this;
        _this.locationService = locationService;
        return _this;
    }
    return LocationController;
}(express_ext_3.QueryController));
exports.LocationController = LocationController;
var LocationInfomationController = /** @class */ (function (_super) {
    __extends(LocationInfomationController, _super);
    function LocationInfomationController(log, service) {
        return _super.call(this, log, service) || this;
    }
    return LocationInfomationController;
}(express_ext_3.QueryController));
exports.LocationInfomationController = LocationInfomationController;
function useLocationController(log, db, mapper) {
    var query = (0, query_mappers_1.useQuery)('location', mapper, location_2.locationModel, true);
    var builder = new query_core_1.SearchBuilder(db.query, 'location', location_2.locationModel, db.driver, query);
    var repository = new query_core_1.Repository(db, 'location', location_2.locationModel);
    var infoRepository = new review_reaction_query_1.SqlInfoRepository(db, 'locationinfo', rate_core_1.infoModel, pg_extension_1.buildToSave);
    var service = new LocationService(builder.search, repository, infoRepository);
    return new LocationController(log, service);
}
exports.useLocationController = useLocationController;
function useLocationRateController(log, db, mapper) {
    var rateRepository = new rate_query_1.SqlRateRepository(db, 'locationrate', rate_core_1.rateModel, pg_extension_1.buildToSave, 5, 'locationinfo', 'rate', 'count', 'score', 'author', 'id');
    var infoRepository = new review_reaction_query_1.SqlInfoRepository(db, 'locationinfo', rate_core_1.infoModel, pg_extension_1.buildToSave);
    var rateValidator = new rate_core_1.RateValidator(rate_core_1.rateModel, xvalidators_1.check, 5);
    var rateService = new rate_core_1.RateService(rateRepository, infoRepository);
    return new review_reaction_express_1.RateController(log, rateService.rate, rateValidator.validate, 'author', 'id');
}
exports.useLocationRateController = useLocationRateController;
function useLocationReactionService(db, mapper) {
    var query = (0, query_mappers_1.useQuery)('locationrate', mapper, rate_core_1.rateModel, true);
    var builder = new query_core_1.SearchBuilder(db.query, 'locationrate', rate_core_1.rateModel, db.driver, query);
    var rateRepository = new query_core_1.SqlLoadRepository(db.query, 'locationrate', rate_core_1.rateModel, db.param, 'id', 'author');
    var rateReactionRepository = new review_reaction_query_1.SqlReactionRepository(db, 'locationratereaction', review_reaction_query_1.rateReactionModel, 'locationrate', 'usefulCount', 'author', 'id');
    var rateCommentRepository = new review_reaction_query_1.SqlCommentRepository(db, 'locationcomment', review_reaction_query_1.commentModel, 'locationrate', 'id', 'author', 'replyCount', 'author', 'id');
    var queryUrl = (0, pg_extension_1.useUrlQuery)(db.query, 'users', 'imageURL', 'id');
    return new review_reaction_1.ReactionService(builder.search, rateRepository, rateReactionRepository, rateCommentRepository, queryUrl);
}
exports.useLocationReactionService = useLocationReactionService;
function useLocationReactionController(log, db, mapper) {
    var commentValidator = new review_reaction_1.CommentValidator(review_reaction_query_1.commentModel, xvalidators_1.check);
    return new review_reaction_express_1.ReactionController(log, useLocationReactionService(db, mapper), commentValidator, ['time'], ['rate', 'usefulCount', 'replyCount', 'count', 'score'], generate, 'commentId', 'userId', 'author', 'id');
}
exports.useLocationReactionController = useLocationReactionController;
function useLocationRateCommentService(db, mapper) {
    var query = (0, query_mappers_1.useQuery)('locationcomment', mapper, review_reaction_query_1.commentModel, true);
    var builder = new query_core_1.SearchBuilder(db.query, 'locationcomment', review_reaction_query_1.commentModel, db.driver, query);
    var rateCommentRepository = new review_reaction_query_1.SqlCommentRepository(db, 'locationcomment', review_reaction_query_1.commentModel, 'locationrate', 'id', 'author', 'replyCount', 'author', 'time', 'id');
    var queryUrl = (0, pg_extension_1.useUrlQuery)(db.query, 'users', 'imageURL', 'id');
    return new review_reaction_query_2.CommentQuery(builder.search, rateCommentRepository, queryUrl);
}
exports.useLocationRateCommentService = useLocationRateCommentService;
function useLocationRateCommentController(log, db, mapper) {
    return new review_reaction_express_1.RateCommentController(log, useLocationRateCommentService(db, mapper));
}
exports.useLocationRateCommentController = useLocationRateCommentController;
function generate() {
    return shortid_1.default.generate();
}
exports.generate = generate;
function useLocationFollowController(log, db) {
    var service = new pg_extension_1.FollowService(db.execBatch, 'locationfollowing', 'id', 'following', 'locationfollower', 'id', 'follower', 'locationinfomation', 'id', 'followerCount', 'followingCount');
    return new express_ext_1.FollowController(log, service, 'id', 'target');
}
exports.useLocationFollowController = useLocationFollowController;
function useSavedLocationController(log, db) {
    var savedRepository = new pg_extension_1.ArrayRepository(db.query, db.exec, 'savedlocation', 'items', 'id');
    var repository = new query_core_1.QueryRepository(db, 'location', location_2.locationModel);
    var service = new onecore_1.SavedService(savedRepository, repository.query, 50);
    return new express_ext_2.SavedController(log, service, 'itemId', 'id');
}
exports.useSavedLocationController = useSavedLocationController;
var LocationInfomationService = /** @class */ (function (_super) {
    __extends(LocationInfomationService, _super);
    function LocationInfomationService(search, repository) {
        return _super.call(this, search, repository) || this;
    }
    return LocationInfomationService;
}(onecore_1.ViewSearchManager));
exports.LocationInfomationService = LocationInfomationService;
function useLocationInfomationController(log, db, mapper) {
    var query = (0, query_mappers_1.useQuery)('locationinfomation', mapper, location_1.locationInfomationModel, true);
    var builder = new query_core_1.SearchBuilder(db.query, 'locationinfomation', location_1.locationInfomationModel, db.driver, query);
    var repository = new query_core_1.Repository(db, 'locationinfomation', location_1.locationInfomationModel);
    var service = new LocationInfomationService(builder.search, repository);
    return new LocationInfomationController(log, service);
}
exports.useLocationInfomationController = useLocationInfomationController;
function useLocationUploadController(log, db, storage, deleteFile, generateId, buildUrl, sizesCover, sizesImage, config, model, mapper) {
    var queryItems = (0, query_mappers_1.useQuery)('item', mapper, location_2.locationModel, true);
    var builder = new query_core_1.SearchBuilder(db.query, 'item', location_2.locationModel, query_core_1.postgres, queryItems);
    var repository = new query_core_1.Repository(db, 'item', location_2.locationModel);
    var service = new LocationUploadService(builder.search, repository, storage, deleteFile, generateId, buildUrl, sizesCover, sizesImage, config, model);
    return new upload_express_1.UploadController(log, service, service.getGalllery, generateId, sizesCover, sizesImage);
}
exports.useLocationUploadController = useLocationUploadController;
//# sourceMappingURL=index.js.map