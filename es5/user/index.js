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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUserInfoController = exports.UserInFoController = exports.UserInfoService = exports.useUserFollowController = exports.useReactionController = exports.generate = exports.useUserRateCommentController = exports.useUserReactionController = exports.useUserRateController = exports.useUserController = exports.UserController = exports.UserManager = void 0;
var express_ext_1 = require("express-ext");
var onecore_1 = require("onecore");
var pg_extension_1 = require("pg-extension");
var query_core_1 = require("query-core");
var query_mappers_1 = require("query-mappers");
var rate_core_1 = require("rate-core");
var rate_query_1 = require("rate-query");
var review_reaction_1 = require("review-reaction");
var review_reaction_express_1 = require("review-reaction-express");
var review_reaction_query_1 = require("review-reaction-query");
var shortid_1 = __importDefault(require("shortid"));
var xvalidators_1 = require("xvalidators");
var user_1 = require("./user");
__exportStar(require("./user"), exports);
var UserManager = /** @class */ (function (_super) {
    __extends(UserManager, _super);
    function UserManager(search, repository, infoRepository) {
        var _this = _super.call(this, search, repository) || this;
        _this.repository = repository;
        _this.infoRepository = infoRepository;
        return _this;
    }
    UserManager.prototype.load = function (id) {
        var _this = this;
        return this.repository.load(id).then(function (user) {
            if (!user) {
                return null;
            }
            else {
                return _this.infoRepository.load(id).then(function (info) {
                    if (info) {
                        delete info['id'];
                        user.info = info;
                    }
                    return user;
                });
            }
        });
    };
    return UserManager;
}(onecore_1.ViewSearchManager));
exports.UserManager = UserManager;
var UserController = /** @class */ (function (_super) {
    __extends(UserController, _super);
    function UserController(log, service) {
        return _super.call(this, log, service) || this;
    }
    return UserController;
}(express_ext_1.QueryController));
exports.UserController = UserController;
function useUserController(log, db, mapper) {
    var query = (0, query_mappers_1.useQuery)('users', mapper, user_1.userModel, true);
    var builder = new query_core_1.SearchBuilder(db.query, 'users', user_1.userModel, db.driver, query);
    var repository = new query_core_1.Repository(db, 'users', user_1.userModel);
    var infoRepository = new review_reaction_query_1.SqlInfoRepository(db, 'userrateinfo', rate_core_1.info10Model, pg_extension_1.buildToSave);
    var service = new UserManager(builder.search, repository, infoRepository);
    return new UserController(log, service);
}
exports.useUserController = useUserController;
// -----rate----------------------------
function useUserRateController(log, db, mapper) {
    var rateRepository = new rate_query_1.SqlRateRepository(db, 'userrate', rate_core_1.rateModel, pg_extension_1.buildToSave, 10, 'userrateinfo', 'rate', 'count', 'score', 'author', 'id');
    var infoRepository = new review_reaction_query_1.SqlInfoRepository(db, 'userrateinfo', rate_core_1.info10Model, pg_extension_1.buildToSave);
    var rateValidator = new rate_core_1.RateValidator(rate_core_1.rateModel, xvalidators_1.check, 10);
    var rateService = new rate_core_1.RateService(rateRepository, infoRepository);
    return new review_reaction_express_1.RateController(log, rateService.rate, rateValidator.validate, 'author', 'id');
}
exports.useUserRateController = useUserRateController;
function useUserReactionController(log, db, mapper) {
    var query = (0, query_mappers_1.useQuery)('userrate', mapper, rate_core_1.rateModel, true);
    var builder = new query_core_1.SearchBuilder(db.query, 'userrate', rate_core_1.rateModel, db.driver, query);
    var rateRepository = new query_core_1.SqlLoadRepository(db.query, 'userrate', rate_core_1.rateModel, db.param, 'id', 'author');
    var rateReactionRepository = new review_reaction_query_1.SqlReactionRepository(db, 'userratereaction', review_reaction_query_1.rateReactionModel, 'userrate', 'usefulCount', 'author', 'id');
    var rateCommentRepository = new review_reaction_query_1.SqlCommentRepository(db, 'userratecomment', review_reaction_query_1.commentModel, 'userrate', 'id', 'author', 'replyCount', 'author', 'time', 'id');
    var service = new review_reaction_1.ReactionService(builder.search, rateRepository, rateReactionRepository, rateCommentRepository);
    var commentValidator = new review_reaction_1.CommentValidator(review_reaction_query_1.commentModel, xvalidators_1.check);
    return new review_reaction_express_1.ReactionController(log, service, commentValidator, ['time'], ['rate', 'usefulCount', 'replyCount', 'count', 'score'], generate, 'commentId', 'userId', 'author', 'id');
}
exports.useUserReactionController = useUserReactionController;
function useUserRateCommentController(log, db, mapper) {
    var query = (0, query_mappers_1.useQuery)('userratecomment', mapper, review_reaction_query_1.commentModel, true);
    var builder = new query_core_1.SearchBuilder(db.query, 'userratecomment', review_reaction_query_1.commentModel, db.driver, query);
    var rateCommentRepository = new review_reaction_query_1.SqlCommentRepository(db, 'userratecomment', review_reaction_query_1.commentModel, 'userrate', 'id', 'author', 'replyCount', 'author', 'time', 'id');
    var service = new review_reaction_query_1.CommentQuery(builder.search, rateCommentRepository);
    return new review_reaction_express_1.RateCommentController(log, service);
}
exports.useUserRateCommentController = useUserRateCommentController;
function generate() {
    return shortid_1.default.generate();
}
exports.generate = generate;
// --reaction------------------------------------
function useReactionController(log, db) {
    var service = new pg_extension_1.ReactService(db, 'userreaction', 'id', 'author', 'reaction', 'level', 'count', 'userinfo', 'id', 'reactioncount');
    return new express_ext_1.UserReactionController(log, service, 'author', 'id', 'reaction');
}
exports.useReactionController = useReactionController;
// -------follow-----------------------------
function useUserFollowController(log, db) {
    var service = new pg_extension_1.FollowService(db.execBatch, 'userfollowing', 'id', 'following', 'userfollower', 'id', 'follower', 'userinfo', 'id', 'followerCount', 'followingCount');
    return new express_ext_1.FollowController(log, service, 'id', 'target');
}
exports.useUserFollowController = useUserFollowController;
var UserInfoService = /** @class */ (function (_super) {
    __extends(UserInfoService, _super);
    function UserInfoService(search, repository) {
        return _super.call(this, search, repository) || this;
    }
    return UserInfoService;
}(onecore_1.ViewSearchManager));
exports.UserInfoService = UserInfoService;
var UserInFoController = /** @class */ (function (_super) {
    __extends(UserInFoController, _super);
    function UserInFoController(log, service) {
        return _super.call(this, log, service) || this;
    }
    return UserInFoController;
}(express_ext_1.QueryController));
exports.UserInFoController = UserInFoController;
function useUserInfoController(log, db, mapper) {
    var query = (0, query_mappers_1.useQuery)('userinfo', mapper, user_1.userInfoModel, true);
    var builder = new query_core_1.SearchBuilder(db.query, 'userinfo', user_1.userInfoModel, db.driver, query);
    var repository = new query_core_1.Repository(db, 'userinfo', user_1.userInfoModel);
    var service = new UserInfoService(builder.search, repository);
    return new UserInFoController(log, service);
}
exports.useUserInfoController = useUserInfoController;
//# sourceMappingURL=index.js.map