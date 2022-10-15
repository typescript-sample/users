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
exports.useSavedFilmsController = exports.generate = exports.useFilmRateCommentController = exports.useFilmReactionController = exports.useFilmRateController = exports.useFilmController = exports.FilmService = void 0;
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
var film_1 = require("./film");
var FilmService = /** @class */ (function (_super) {
    __extends(FilmService, _super);
    function FilmService(search, repository, infoRepository) {
        var _this = _super.call(this, search, repository) || this;
        _this.repository = repository;
        _this.infoRepository = infoRepository;
        return _this;
    }
    FilmService.prototype.load = function (id) {
        var _this = this;
        return this.repository.load(id).then(function (film) {
            if (!film) {
                return null;
            }
            else {
                return _this.infoRepository.load(id).then(function (info) {
                    if (info) {
                        delete info['id'];
                        film.info = info;
                    }
                    return film;
                });
            }
        });
    };
    return FilmService;
}(onecore_1.ViewSearchManager));
exports.FilmService = FilmService;
function useFilmController(log, db, mapper) {
    var query = (0, query_mappers_1.useQuery)('film', mapper, film_1.filmModel, true);
    var builder = new query_core_1.SearchBuilder(db.query, 'film', film_1.filmModel, db.driver, query);
    var repository = new query_core_1.Repository(db, 'film', film_1.filmModel);
    var infoRepository = new review_reaction_query_1.SqlInfoRepository(db, 'filmrateinfo', rate_core_1.info10Model, pg_extension_1.buildToSave);
    var service = new FilmService(builder.search, repository, infoRepository);
    return new express_ext_1.QueryController(log, service);
}
exports.useFilmController = useFilmController;
function useFilmRateController(log, db, mapper) {
    var rateRepository = new rate_query_1.SqlRateRepository(db, 'filmrate', rate_core_1.rateModel, pg_extension_1.buildToSave, 10, 'filmrateinfo', 'rate', 'count', 'score', 'author', 'id');
    var infoRepository = new review_reaction_query_1.SqlInfoRepository(db, 'filmrateinfo', rate_core_1.info10Model, pg_extension_1.buildToSave);
    var rateValidator = new rate_core_1.RateValidator(rate_core_1.rateModel, xvalidators_1.check, 10);
    var rateService = new rate_core_1.RateService(rateRepository, infoRepository);
    return new review_reaction_express_1.RateController(log, rateService.rate, rateValidator.validate, 'author', 'id');
}
exports.useFilmRateController = useFilmRateController;
function useFilmReactionController(log, db, mapper) {
    var query = (0, query_mappers_1.useQuery)('filmrate', mapper, rate_core_1.rateModel, true);
    var builder = new query_core_1.SearchBuilder(db.query, 'filmrate', rate_core_1.rateModel, db.driver, query);
    var rateRepository = new query_core_1.SqlLoadRepository(db.query, 'filmrate', rate_core_1.rateModel, db.param, 'id', 'author');
    var rateReactionRepository = new review_reaction_query_1.SqlReactionRepository(db, 'filmratereaction', review_reaction_query_1.rateReactionModel, 'filmrate', 'usefulCount', 'author', 'id');
    var rateCommentRepository = new review_reaction_query_1.SqlCommentRepository(db, 'filmratecomment', review_reaction_query_1.commentModel, 'filmrate', 'id', 'author', 'replyCount', 'author', 'time', 'id');
    var queryUrl = (0, pg_extension_1.useUrlQuery)(db.query, 'users', 'imageURL', 'id');
    var service = new review_reaction_1.ReactionService(builder.search, rateRepository, rateReactionRepository, rateCommentRepository, queryUrl);
    var commentValidator = new review_reaction_1.CommentValidator(review_reaction_query_1.commentModel, xvalidators_1.check);
    return new review_reaction_express_1.ReactionController(log, service, commentValidator, ['time'], ['rate', 'usefulCount', 'replyCount', 'count', 'score'], generate, 'commentId', 'userId', 'author', 'id');
}
exports.useFilmReactionController = useFilmReactionController;
function useFilmRateCommentController(log, db, mapper) {
    var query = (0, query_mappers_1.useQuery)('filmratecomment', mapper, review_reaction_query_1.commentModel, true);
    var builder = new query_core_1.SearchBuilder(db.query, 'filmratecomment', review_reaction_query_1.commentModel, db.driver, query);
    var rateCommentRepository = new review_reaction_query_1.SqlCommentRepository(db, 'filmratecomment', review_reaction_query_1.commentModel, 'filmrate', 'id', 'author', 'replyCount', 'author', 'time', 'id');
    var queryUrl = (0, pg_extension_1.useUrlQuery)(db.query, 'users', 'imageURL', 'id');
    var service = new review_reaction_query_2.CommentQuery(builder.search, rateCommentRepository, queryUrl);
    return new review_reaction_express_1.RateCommentController(log, service);
}
exports.useFilmRateCommentController = useFilmRateCommentController;
function generate() {
    return shortid_1.default.generate();
}
exports.generate = generate;
function useSavedFilmsController(log, db) {
    var savedRepository = new pg_extension_1.ArrayRepository(db.query, db.exec, 'savedfilm', 'items', 'id');
    var repository = new query_core_1.QueryRepository(db, 'film', film_1.filmModel);
    var service = new onecore_1.SavedService(savedRepository, repository.query, 50);
    return new express_ext_1.SavedController(log, service, 'itemId', 'id');
}
exports.useSavedFilmsController = useSavedFilmsController;
//# sourceMappingURL=index.js.map