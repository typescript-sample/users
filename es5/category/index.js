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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCompanyCategoryController = exports.useFilmCategoryController = exports.useItemCategoryController = exports.CategoryController = exports.CategoryManager = void 0;
var express_ext_1 = require("express-ext");
var onecore_1 = require("onecore");
var query_core_1 = require("query-core");
var query_mappers_1 = require("query-mappers");
var category_1 = require("./category");
var CategoryManager = /** @class */ (function (_super) {
    __extends(CategoryManager, _super);
    function CategoryManager(search, repository) {
        return _super.call(this, search, repository) || this;
    }
    return CategoryManager;
}(onecore_1.Manager));
exports.CategoryManager = CategoryManager;
var CategoryController = /** @class */ (function (_super) {
    __extends(CategoryController, _super);
    function CategoryController(log, categoryService) {
        var _this = _super.call(this, log, categoryService) || this;
        _this.array = ['status'];
        return _this;
    }
    return CategoryController;
}(express_ext_1.Controller));
exports.CategoryController = CategoryController;
// Item category
function useItemCategoryController(log, db, mapper) {
    var query = (0, query_mappers_1.useQuery)('itemcategory', mapper, category_1.categoryModel, true);
    var builder = new query_core_1.SearchBuilder(db.query, 'itemcategory', category_1.categoryModel, db.driver, query);
    var repository = new query_core_1.Repository(db, 'itemcategory', category_1.categoryModel);
    var service = new CategoryManager(builder.search, repository);
    return new CategoryController(log, service);
}
exports.useItemCategoryController = useItemCategoryController;
// Film category
function useFilmCategoryController(log, db, mapper) {
    var query = (0, query_mappers_1.useQuery)('filmcategory', mapper, category_1.categoryModel, true);
    var builder = new query_core_1.SearchBuilder(db.query, 'filmcategory', category_1.categoryModel, db.driver, query);
    var repository = new query_core_1.Repository(db, 'filmcategory', category_1.categoryModel);
    var service = new CategoryManager(builder.search, repository);
    return new CategoryController(log, service);
}
exports.useFilmCategoryController = useFilmCategoryController;
// Company category
function useCompanyCategoryController(log, db, mapper) {
    var query = (0, query_mappers_1.useQuery)('companycategory', mapper, category_1.categoryModel, true);
    var builder = new query_core_1.SearchBuilder(db.query, 'companycategory', category_1.categoryModel, db.driver, query);
    var repository = new query_core_1.Repository(db, 'companycategory', category_1.categoryModel);
    var service = new CategoryManager(builder.search, repository);
    return new CategoryController(log, service);
}
exports.useCompanyCategoryController = useCompanyCategoryController;
//# sourceMappingURL=index.js.map