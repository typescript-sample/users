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
exports.useBackOfficeRoomController = exports.BackOfficeRoomController = exports.RoomManager = void 0;
var express_ext_1 = require("express-ext");
var onecore_1 = require("onecore");
var query_core_1 = require("query-core");
var query_mappers_1 = require("query-mappers");
var room_1 = require("./room");
var RoomManager = /** @class */ (function (_super) {
    __extends(RoomManager, _super);
    function RoomManager(search, repository) {
        return _super.call(this, search, repository) || this;
    }
    return RoomManager;
}(onecore_1.Manager));
exports.RoomManager = RoomManager;
var BackOfficeRoomController = /** @class */ (function (_super) {
    __extends(BackOfficeRoomController, _super);
    function BackOfficeRoomController(log, roomService) {
        return _super.call(this, log, roomService) || this;
    }
    return BackOfficeRoomController;
}(express_ext_1.Controller));
exports.BackOfficeRoomController = BackOfficeRoomController;
function useBackOfficeRoomController(log, db, mapper) {
    var queryRoom = (0, query_mappers_1.useQuery)('room', mapper, room_1.roomModel, true);
    var builder = new query_core_1.SearchBuilder(db.query, 'room', room_1.roomModel, db.driver, queryRoom);
    var repository = new query_core_1.Repository(db, 'room', room_1.roomModel);
    var service = new RoomManager(builder.search, repository);
    return new BackOfficeRoomController(log, service);
}
exports.useBackOfficeRoomController = useBackOfficeRoomController;
//# sourceMappingURL=index.js.map