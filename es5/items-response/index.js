"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useResponseReactionController = exports.useResponseReactionService = exports.useResponseController = exports.useResponseService = exports.ResponseManager = exports.generate = exports.ResponseController = void 0;
var pg_extension_1 = require("pg-extension");
var query_core_1 = require("query-core");
var query_mappers_1 = require("query-mappers");
var review_reaction_1 = require("review-reaction");
var review_reaction_express_1 = require("review-reaction-express");
var review_reaction_query_1 = require("review-reaction-query");
var shortid_1 = __importDefault(require("shortid"));
var xvalidators_1 = require("xvalidators");
var response_1 = require("./response");
var express_ext_1 = require("express-ext");
__exportStar(require("./response"), exports);
var ResponseController = /** @class */ (function () {
    function ResponseController(log, responseService, validator) {
        this.log = log;
        this.responseService = responseService;
        this.validator = validator;
        this.reply = this.reply.bind(this);
    }
    ResponseController.prototype.reply = function (req, res) {
        var _this = this;
        var id = req.params.id || req.body.id || '';
        var author = req.params.author || req.body.author || '';
        var response = __assign({ id: id, author: author }, req.body);
        response.time = new Date();
        this.validator
            .validate(response)
            .then(function (errors) {
            if (errors && errors.length > 0) {
                res.status((0, express_ext_1.getStatusCode)(errors)).json(errors).send();
            }
            else {
                _this.responseService
                    .response(response)
                    .then(function (rs) {
                    return res.status(200).json(rs).send();
                })
                    .catch(function (err) { return (0, express_ext_1.handleError)(err, res, _this.log); });
            }
        })
            .catch(function (err) { return (0, express_ext_1.handleError)(err, res, _this.log); });
    };
    return ResponseController;
}());
exports.ResponseController = ResponseController;
function generate() {
    return shortid_1.default.generate();
}
exports.generate = generate;
// Response
var ResponseManager = /** @class */ (function () {
    function ResponseManager(find, repository, infoRepository) {
        this.find = find;
        this.repository = repository;
        this.infoRepository = infoRepository;
        this.response = this.response.bind(this);
    }
    ResponseManager.prototype.response = function (response) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var info, r0, exist, r1, sr, history_1, res;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        response.time = new Date();
                        return [4 /*yield*/, ((_b = (_a = this.infoRepository).exist) === null || _b === void 0 ? void 0 : _b.call(_a, response.id))];
                    case 1:
                        info = _c.sent();
                        if (!!info) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.repository.insert(response, true)];
                    case 2:
                        r0 = _c.sent();
                        return [2 /*return*/, r0];
                    case 3: return [4 /*yield*/, this.repository.load(response.id, response.author)];
                    case 4:
                        exist = _c.sent();
                        if (!!exist) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.repository.insert(response)];
                    case 5:
                        r1 = _c.sent();
                        return [2 /*return*/, r1];
                    case 6:
                        sr = { description: exist.description, time: exist.time };
                        if (exist.histories && exist.histories.length > 0) {
                            history_1 = exist.histories;
                            history_1.push(sr);
                            response.histories = history_1;
                        }
                        else {
                            response.histories = [sr];
                        }
                        return [4 /*yield*/, this.repository.update(response)];
                    case 7:
                        res = _c.sent();
                        return [2 /*return*/, res];
                }
            });
        });
    };
    return ResponseManager;
}());
exports.ResponseManager = ResponseManager;
function useResponseService(db, mapper) {
    var query = (0, query_mappers_1.useQuery)('itemresponse', mapper, response_1.responseModel, true);
    var builder = new query_core_1.SearchBuilder(db.query, 'itemresponse', response_1.responseModel, db.driver, query);
    var repository = new query_core_1.GenericRepository(db, 'itemresponse', response_1.responseModel, 'id', 'author');
    var infoRepository = new review_reaction_query_1.SqlInfoRepository(db, 'iteminfo', response_1.infoModel, pg_extension_1.buildToSave);
    return new ResponseManager(builder.search, repository, infoRepository);
}
exports.useResponseService = useResponseService;
function useResponseController(log, db, mapper) {
    var responseValidator = (0, xvalidators_1.createValidator)(response_1.responseModel);
    return new ResponseController(log, useResponseService(db, mapper), responseValidator);
}
exports.useResponseController = useResponseController;
// Reaction
function useResponseReactionService(db, mapper) {
    var query = (0, query_mappers_1.useQuery)('itemresponse', mapper, response_1.responseModel, true);
    var builder = new query_core_1.SearchBuilder(db.query, 'itemresponse', response_1.responseModel, db.driver, query);
    var repository = new query_core_1.GenericRepository(db, 'itemresponse', response_1.responseModel, 'id', 'author');
    var responseReactionRepository = new review_reaction_query_1.SqlReactionRepository(db, 'itemresponsereaction', review_reaction_query_1.rateReactionModel, 'itemresponse', 'usefulCount', 'author', 'id');
    var responseCommentRepository = new review_reaction_query_1.SqlCommentRepository(db, 'itemcomment', review_reaction_query_1.commentModel, 'itemresponse', 'id', 'author', 'replyCount', 'author', 'time', 'id');
    return new review_reaction_1.ReactionService(builder.search, repository, responseReactionRepository, responseCommentRepository);
}
exports.useResponseReactionService = useResponseReactionService;
function useResponseReactionController(log, db, mapper) {
    var commentValidator = new review_reaction_1.CommentValidator(review_reaction_query_1.commentModel, xvalidators_1.check);
    return new review_reaction_express_1.ReactionController(log, useResponseReactionService(db, mapper), commentValidator, ['time'], ['response', 'usefulCount', 'replyCount', 'count', 'score'], generate, 'commentId', 'userId', 'author', 'id');
}
exports.useResponseReactionController = useResponseReactionController;
//# sourceMappingURL=index.js.map