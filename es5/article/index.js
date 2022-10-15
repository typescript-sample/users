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
exports.generate = exports.useArticleRateCommentController = exports.useArticleReactionController = exports.useArticleRateController = exports.useArticleController = exports.ArticleManager = void 0;
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
var article_1 = require("./article");
__exportStar(require("./article"), exports);
var ArticleManager = /** @class */ (function (_super) {
    __extends(ArticleManager, _super);
    function ArticleManager(repository) {
        return _super.call(this, repository) || this;
    }
    return ArticleManager;
}(onecore_1.ViewManager));
exports.ArticleManager = ArticleManager;
function useArticleController(log, db, mapper) {
    var queryArticles = (0, query_mappers_1.useQuery)('article', mapper, article_1.articleModel, true);
    var builder = new query_core_1.SearchBuilder(db.query, 'article', article_1.articleModel, query_core_1.postgres, queryArticles);
    var repository = new query_core_1.Repository(db, 'article', article_1.articleModel);
    var service = new ArticleManager(repository);
    return new express_ext_1.LoadSearchHandler(log, builder.search, service);
}
exports.useArticleController = useArticleController;
function useArticleRateController(log, db, mapper) {
    var rateRepository = new rate_query_1.SqlRateRepository(db, 'articlerate', rate_core_1.rateModel, pg_extension_1.buildToSave, 5, 'articleinfo', 'rate', 'count', 'score', 'author', 'id');
    var infoRepository = new review_reaction_query_1.SqlInfoRepository(db, 'articleinfo', rate_core_1.infoModel, pg_extension_1.buildToSave);
    var rateValidator = new rate_core_1.RateValidator(rate_core_1.rateModel, xvalidators_1.check, 5);
    var rateService = new rate_core_1.RateService(rateRepository, infoRepository);
    return new review_reaction_express_1.RateController(log, rateService.rate, rateValidator.validate, 'author', 'id');
}
exports.useArticleRateController = useArticleRateController;
function useArticleReactionController(log, db, mapper) {
    var commentValidator = new review_reaction_1.CommentValidator(review_reaction_query_1.commentModel, xvalidators_1.check);
    var query = (0, query_mappers_1.useQuery)('articlerate', mapper, rate_core_1.rateModel, true);
    var builder = new query_core_1.SearchBuilder(db.query, 'articlerate', rate_core_1.rateModel, db.driver, query);
    var rateRepository = new query_core_1.SqlLoadRepository(db.query, 'articlerate', rate_core_1.rateModel, db.param, 'id', 'author');
    var rateReactionRepository = new review_reaction_query_1.SqlReactionRepository(db, 'articleratereaction', review_reaction_query_1.rateReactionModel, 'articlerate', 'usefulCount', 'author', 'id');
    var rateCommentRepository = new review_reaction_query_1.SqlCommentRepository(db, 'articleratecomment', review_reaction_query_1.commentModel, 'articlerate', 'id', 'author', 'replyCount', 'author', 'id');
    var queryUrl = (0, pg_extension_1.useUrlQuery)(db.query, 'users', 'imageURL', 'id');
    var service = new review_reaction_1.ReactionService(builder.search, rateRepository, rateReactionRepository, rateCommentRepository, queryUrl);
    return new review_reaction_express_1.ReactionController(log, service, commentValidator, ['time'], ['rate', 'usefulCount', 'replyCount', 'count', 'score'], generate, 'commentId', 'userId', 'author', 'id');
}
exports.useArticleReactionController = useArticleReactionController;
function useArticleRateCommentController(log, db, mapper) {
    var query = (0, query_mappers_1.useQuery)('articleratecomment', mapper, review_reaction_query_1.commentModel, true);
    var builder = new query_core_1.SearchBuilder(db.query, 'articleratecomment', review_reaction_query_1.commentModel, db.driver, query);
    var rateCommentRepository = new review_reaction_query_1.SqlCommentRepository(db, 'articleratecomment', review_reaction_query_1.commentModel, 'cinemarate', 'id', 'author', 'replyCount', 'author', 'time', 'id');
    var queryUrl = (0, pg_extension_1.useUrlQuery)(db.query, 'users', 'imageURL', 'id');
    var service = new review_reaction_query_1.CommentQuery(builder.search, rateCommentRepository, queryUrl);
    return new review_reaction_express_1.RateCommentController(log, service);
}
exports.useArticleRateCommentController = useArticleRateCommentController;
function generate() {
    return shortid_1.default.generate();
}
exports.generate = generate;
//# sourceMappingURL=index.js.map