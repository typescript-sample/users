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
exports.useMyArticleController = exports.ArticleController = exports.ArticleManager = void 0;
var express_ext_1 = require("express-ext");
var onecore_1 = require("onecore");
var query_core_1 = require("query-core");
var query_mappers_1 = require("query-mappers");
var article_1 = require("./article");
__exportStar(require("./article"), exports);
var ArticleManager = /** @class */ (function (_super) {
    __extends(ArticleManager, _super);
    function ArticleManager(search, repository) {
        return _super.call(this, search, repository) || this;
    }
    return ArticleManager;
}(onecore_1.Manager));
exports.ArticleManager = ArticleManager;
var ArticleController = /** @class */ (function (_super) {
    __extends(ArticleController, _super);
    function ArticleController(log, service, build) {
        return _super.call(this, log, service, build) || this;
    }
    return ArticleController;
}(express_ext_1.Controller));
exports.ArticleController = ArticleController;
function useMyArticleController(log, db, mapper) {
    var queryArticles = (0, query_mappers_1.useQuery)('article', mapper, article_1.articleModel, true);
    var builder = new query_core_1.SearchBuilder(db.query, 'article', article_1.articleModel, query_core_1.postgres, queryArticles);
    var repository = new query_core_1.Repository(db, 'article', article_1.articleModel);
    var service = new ArticleManager(builder.search, repository);
    return new ArticleController(log, service);
}
exports.useMyArticleController = useMyArticleController;
//# sourceMappingURL=index.js.map