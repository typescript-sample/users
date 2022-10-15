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
exports.useSavedController = exports.useItemController = exports.ItemController = exports.ItemManager = void 0;
var express_ext_1 = require("express-ext");
var onecore_1 = require("onecore");
var pg_extension_1 = require("pg-extension");
var query_core_1 = require("query-core");
var item_1 = require("./item");
var query_1 = require("./query");
__exportStar(require("./item"), exports);
var ItemManager = /** @class */ (function (_super) {
    __extends(ItemManager, _super);
    function ItemManager(search, itemRepository, saveItemsRepository, max) {
        var _this = _super.call(this, search, itemRepository) || this;
        _this.itemRepository = itemRepository;
        _this.saveItemsRepository = saveItemsRepository;
        _this.max = max;
        return _this;
    }
    return ItemManager;
}(onecore_1.ViewSearchManager));
exports.ItemManager = ItemManager;
var ItemController = /** @class */ (function (_super) {
    __extends(ItemController, _super);
    function ItemController(log, itemQuery) {
        var _this = _super.call(this, log, itemQuery) || this;
        _this.itemQuery = itemQuery;
        return _this;
    }
    return ItemController;
}(express_ext_1.QueryController));
exports.ItemController = ItemController;
function useItemController(log, db) {
    var savedItemMax = 50;
    var builder = new query_core_1.SearchBuilder(db.query, 'item', item_1.itemModel, query_core_1.postgres, query_1.buildQuery);
    var repository = new query_core_1.Repository(db, 'item', item_1.itemModel);
    var saveItemRepository = new pg_extension_1.ArrayRepository(db.query, db.exec, 'saveditem', 'items', 'id');
    var service = new ItemManager(builder.search, repository, saveItemRepository, savedItemMax);
    return new ItemController(log, service);
}
exports.useItemController = useItemController;
function useSavedController(log, db) {
    var savedRepository = new pg_extension_1.ArrayRepository(db.query, db.exec, 'saveditem', 'items', 'id');
    var repository = new query_core_1.QueryRepository(db, 'item', item_1.itemModel);
    var service = new onecore_1.SavedService(savedRepository, repository.query, 50);
    return new express_ext_1.SavedController(log, service, 'itemId', 'id');
}
exports.useSavedController = useSavedController;
//# sourceMappingURL=index.js.map