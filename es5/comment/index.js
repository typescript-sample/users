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
exports.useCommentController = exports.useCommentService = exports.CommentManager = exports.CommentController = void 0;
var onecore_1 = require("onecore");
var query_core_1 = require("query-core");
var query_mappers_1 = require("query-mappers");
var comment_1 = require("./comment");
var query_1 = require("./query");
__exportStar(require("./comment"), exports);
var express_ext_1 = require("express-ext");
var CommentController = /** @class */ (function (_super) {
    __extends(CommentController, _super);
    function CommentController(log, service) {
        var _this = _super.call(this, log, service) || this;
        _this.service = service;
        return _this;
    }
    return CommentController;
}(express_ext_1.Controller));
exports.CommentController = CommentController;
var CommentManager = /** @class */ (function (_super) {
    __extends(CommentManager, _super);
    function CommentManager(search, repository) {
        return _super.call(this, search, repository) || this;
    }
    return CommentManager;
}(onecore_1.Manager));
exports.CommentManager = CommentManager;
function useCommentService(db, mapper) {
    var queryComment = (0, query_mappers_1.useQuery)('comment', mapper, comment_1.commentModel, true);
    var builder = new query_core_1.SearchBuilder(db.query, 'comments', comment_1.commentModel, db.driver, query_1.buildQuery);
    var repository = new query_core_1.Repository(db, 'comments', comment_1.commentModel);
    return new CommentManager(builder.search, repository);
}
exports.useCommentService = useCommentService;
function useCommentController(log, db, mapper) {
    return new CommentController(log, useCommentService(db, mapper));
}
exports.useCommentController = useCommentController;
//# sourceMappingURL=index.js.map