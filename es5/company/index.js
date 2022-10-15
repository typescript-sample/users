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
exports.generate = exports.useCompanyRateCommentController = exports.useCompanyRateCommentService = exports.useCompanyRateReactionController = exports.useCompanyRateController = exports.useCompanyController = exports.CompanyService = void 0;
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
var company_1 = require("./company");
var company_2 = require("./company");
var CompanyService = /** @class */ (function (_super) {
    __extends(CompanyService, _super);
    function CompanyService(search, repository, infoRepository) {
        var _this = _super.call(this, search, repository) || this;
        _this.repository = repository;
        _this.infoRepository = infoRepository;
        return _this;
    }
    CompanyService.prototype.load = function (id) {
        var _this = this;
        return this.repository.load(id).then(function (company) {
            if (!company) {
                return null;
            }
            else {
                return _this.infoRepository.load(id).then(function (info) {
                    if (info) {
                        delete info['id'];
                        delete info['count'];
                        delete info['score'];
                        company.info = info;
                    }
                    return company;
                });
            }
        });
    };
    return CompanyService;
}(onecore_1.ViewSearchManager));
exports.CompanyService = CompanyService;
function useCompanyController(log, db, mapper) {
    var query = (0, query_mappers_1.useQuery)('company', mapper, company_2.companyModel, true);
    var builder = new query_core_1.SearchBuilder(db.query, 'company', company_2.companyModel, db.driver, query);
    var repository = new query_core_1.Repository(db, 'company', company_2.companyModel);
    var infoRepository = new review_reaction_query_1.SqlInfoRepository(db, 'companyratefullinfo', rate_core_1.infoModel, pg_extension_1.buildToSave);
    var service = new CompanyService(builder.search, repository, infoRepository);
    return new express_ext_1.QueryController(log, service);
}
exports.useCompanyController = useCompanyController;
function useCompanyRateController(log, db, mapper) {
    var rateRepository = new rate_query_1.SqlRatesRepository(db, 'companyrate', 'companyratefullinfo', ['companyrateinfo01', 'companyrateinfo02', 'companyrateinfo03', 'companyrateinfo04', 'companyrateinfo05'], company_1.rateCriteriaModel, pg_extension_1.buildToSave, 5, 'rate', 'count', 'score', 'author', 'id');
    var infoRepository = new review_reaction_query_1.SqlInfoRepository(db, 'companyratefullinfo', rate_core_1.infoModel, pg_extension_1.buildToSave);
    var rateValidator = new rate_core_1.RatesValidator(company_1.rateCriteriaModel, xvalidators_1.check, 5, 5);
    var rateService = new rate_core_1.RatesService(rateRepository, infoRepository);
    return new review_reaction_express_1.RateController(log, rateService.rate, rateValidator.validate, 'author', 'id');
}
exports.useCompanyRateController = useCompanyRateController;
function useCompanyRateReactionController(log, db, mapper) {
    var query = (0, query_mappers_1.useQuery)('companyrate', mapper, company_1.rateCriteriaModel, true);
    var builder = new query_core_1.SearchBuilder(db.query, 'companyrate', company_1.rateCriteriaModel, db.driver, query);
    var rateRepository = new query_core_1.SqlLoadRepository(db.query, 'companyrate', company_1.rateCriteriaModel, db.param, 'id', 'author');
    var rateReactionRepository = new review_reaction_query_1.SqlReactionRepository(db, 'companyratereaction', review_reaction_query_1.rateReactionModel, 'companyrate', 'usefulCount', 'author', 'id');
    var rateCommentRepository = new review_reaction_query_1.SqlCommentRepository(db, 'companyratecomment', review_reaction_query_1.commentModel, 'companyrate', 'id', 'author', 'replyCount', 'author', 'id');
    var service = new review_reaction_1.ReactionService(builder.search, rateRepository, rateReactionRepository, rateCommentRepository);
    var commentValidator = new review_reaction_1.CommentValidator(review_reaction_query_1.commentModel, xvalidators_1.check);
    return new review_reaction_express_1.ReactionController(log, service, commentValidator, ['time'], ['rates', 'usefulCount', 'replyCount', 'count', 'score'], generate, 'commentId', 'userId', 'author', 'id');
}
exports.useCompanyRateReactionController = useCompanyRateReactionController;
function useCompanyRateCommentService(db, mapper) {
    var query = (0, query_mappers_1.useQuery)('companyratecomment', mapper, review_reaction_query_1.commentModel, true);
    var builder = new query_core_1.SearchBuilder(db.query, 'companyratecomment', review_reaction_query_1.commentModel, db.driver, query);
    var rateCommentRepository = new review_reaction_query_1.SqlCommentRepository(db, 'companyratecomment', review_reaction_query_1.commentModel, 'companyrate', 'id', 'author', 'replyCount', 'author', 'time', 'id');
    var queryUrl = (0, pg_extension_1.useUrlQuery)(db.query, 'users', 'imageURL', 'id');
    return new review_reaction_query_1.CommentQuery(builder.search, rateCommentRepository, queryUrl);
}
exports.useCompanyRateCommentService = useCompanyRateCommentService;
function useCompanyRateCommentController(log, db, mapper) {
    var query = (0, query_mappers_1.useQuery)('companyratecomment', mapper, review_reaction_query_1.commentModel, true);
    var builder = new query_core_1.SearchBuilder(db.query, 'companyratecomment', review_reaction_query_1.commentModel, db.driver, query);
    var rateCommentRepository = new review_reaction_query_1.SqlCommentRepository(db, 'companyratecomment', review_reaction_query_1.commentModel, 'companyrate', 'id', 'author', 'replyCount', 'author', 'time', 'id');
    var queryUrl = (0, pg_extension_1.useUrlQuery)(db.query, 'users', 'imageURL', 'id');
    var service = new review_reaction_query_1.CommentQuery(builder.search, rateCommentRepository, queryUrl);
    return new review_reaction_express_1.RateCommentController(log, service);
}
exports.useCompanyRateCommentController = useCompanyRateCommentController;
function generate() {
    return shortid_1.default.generate();
}
exports.generate = generate;
//# sourceMappingURL=index.js.map