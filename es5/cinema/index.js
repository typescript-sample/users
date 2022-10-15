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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = exports.useCinemaRateCommentController = exports.useCinemaReactionController = exports.useCinemaRateController = exports.useCinemaController = exports.CinemaService = void 0;
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
var review_reaction_query_2 = require("review-reaction-query");
var shortid_1 = __importDefault(require("shortid"));
var xvalidators_1 = require("xvalidators");
var cinema_1 = require("./cinema");
var CinemaService = /** @class */ (function (_super) {
    __extends(CinemaService, _super);
    function CinemaService(search, repository, infoRepository) {
        var _this = _super.call(this, search, repository) || this;
        _this.repository = repository;
        _this.infoRepository = infoRepository;
        return _this;
    }
    CinemaService.prototype.load = function (id) {
        var _this = this;
        return this.repository.load(id).then(function (cinema) {
            if (!cinema) {
                return null;
            }
            else {
                return _this.infoRepository.load(id).then(function (info) {
                    if (info) {
                        delete info['id'];
                        delete info['count'];
                        delete info['score'];
                        cinema.info = info;
                    }
                    return cinema;
                });
            }
        });
    };
    return CinemaService;
}(onecore_1.ViewSearchManager));
exports.CinemaService = CinemaService;
function useCinemaController(log, db, mapper) {
    var query = (0, query_mappers_1.useQuery)('cinema', mapper, cinema_1.cinemaModel, true);
    var builder = new query_core_1.SearchBuilder(db.query, 'cinema', cinema_1.cinemaModel, db.driver, query);
    var repository = new query_core_1.Repository(db, 'cinema', cinema_1.cinemaModel);
    var infoRepository = new review_reaction_query_1.SqlInfoRepository(db, 'cinemainfo', rate_core_1.infoModel, pg_extension_1.buildToSave);
    var service = new CinemaService(builder.search, repository, infoRepository);
    return new express_ext_1.QueryController(log, service);
}
exports.useCinemaController = useCinemaController;
function useCinemaRateController(log, db, mapper) {
    var rateRepository = new rate_query_1.SqlRateRepository(db, 'cinemarate', rate_core_1.rateModel, pg_extension_1.buildToSave, 5, 'cinemainfo', 'rate', 'count', 'score', 'author', 'id');
    var infoRepository = new review_reaction_query_1.SqlInfoRepository(db, 'cinemainfo', rate_core_1.infoModel, pg_extension_1.buildToSave);
    var rateValidator = new rate_core_1.RateValidator(rate_core_1.rateModel, xvalidators_1.check, 5);
    var rateService = new rate_core_1.RateService(rateRepository, infoRepository);
    return new review_reaction_express_1.RateController(log, rateService.rate, rateValidator.validate, 'author', 'id');
}
exports.useCinemaRateController = useCinemaRateController;
function useCinemaReactionController(log, db, mapper) {
    var commentValidator = new review_reaction_1.CommentValidator(review_reaction_query_1.commentModel, xvalidators_1.check);
    var query = (0, query_mappers_1.useQuery)('cinemarate', mapper, rate_core_1.rateModel, true);
    var builder = new query_core_1.SearchBuilder(db.query, 'cinemarate', rate_core_1.rateModel, db.driver, query);
    var rateRepository = new query_core_1.SqlLoadRepository(db.query, 'cinemarate', rate_core_1.rateModel, db.param, 'id', 'author');
    var rateReactionRepository = new review_reaction_query_1.SqlReactionRepository(db, 'cinemaratereaction', review_reaction_query_1.rateReactionModel, 'cinemarate', 'usefulCount', 'author', 'id');
    var rateCommentRepository = new review_reaction_query_1.SqlCommentRepository(db, 'cinemaratecomment', review_reaction_query_1.commentModel, 'cinemarate', 'id', 'author', 'replyCount', 'author', 'id');
    var service = new review_reaction_1.ReactionService(builder.search, rateRepository, rateReactionRepository, rateCommentRepository);
    return new review_reaction_express_1.ReactionController(log, service, commentValidator, ['time'], ['rate', 'usefulCount', 'replyCount', 'count', 'score'], generate, 'commentId', 'userId', 'author', 'id');
}
exports.useCinemaReactionController = useCinemaReactionController;
function useCinemaRateCommentController(log, db, mapper) {
    var query = (0, query_mappers_1.useQuery)('cinemaratecomment', mapper, review_reaction_query_1.commentModel, true);
    var builder = new query_core_1.SearchBuilder(db.query, 'cinemaratecomment', review_reaction_query_1.commentModel, db.driver, query);
    var rateCommentRepository = new review_reaction_query_1.SqlCommentRepository(db, 'cinemaratecomment', review_reaction_query_1.commentModel, 'cinemarate', 'id', 'author', 'replyCount', 'author', 'time', 'id');
    var queryUrl = (0, pg_extension_1.useUrlQuery)(db.query, 'users', 'imageURL', 'id');
    var service = new review_reaction_query_2.CommentQuery(builder.search, rateCommentRepository, queryUrl);
    return new review_reaction_express_1.RateCommentController(log, service);
}
exports.useCinemaRateCommentController = useCinemaRateCommentController;
function generate() {
    return shortid_1.default.generate();
}
exports.generate = generate;
//# sourceMappingURL=index.js.map