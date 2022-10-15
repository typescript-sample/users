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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SqlReservationRoomRepository = exports.useRoomController = exports.RoomService = exports.RoomController = void 0;
var express_ext_1 = require("express-ext");
var onecore_1 = require("onecore");
var query_core_1 = require("query-core");
var query_mappers_1 = require("query-mappers");
var room_1 = require("./room");
var RoomController = /** @class */ (function (_super) {
    __extends(RoomController, _super);
    function RoomController(log, roomService) {
        var _this = _super.call(this, log, roomService) || this;
        _this.roomService = roomService;
        _this.saveReservation = _this.saveReservation.bind(_this);
        return _this;
    }
    RoomController.prototype.saveReservation = function (req, res) {
        var _this = this;
        var roomid = req.body.roomid;
        var startdate = req.body.startdate;
        var enddate = req.body.enddate;
        this.roomService.saveReservation(roomid, startdate, enddate).then(function (data) {
            return res.status(200).json(data).end();
        })
            .catch(function (err) { return _this.log(err); });
    };
    return RoomController;
}(express_ext_1.QueryController));
exports.RoomController = RoomController;
var RoomService = /** @class */ (function (_super) {
    __extends(RoomService, _super);
    function RoomService(search, repository, reservationRepository) {
        var _this = _super.call(this, search, repository) || this;
        _this.reservationRepository = reservationRepository;
        _this.saveReservation = _this.saveReservation.bind(_this);
        return _this;
    }
    RoomService.prototype.saveReservation = function (roomid, startdate, enddate) {
        return __awaiter(this, void 0, void 0, function () {
            var test, rep;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.reservationRepository.load(roomid)];
                    case 1:
                        test = _a.sent();
                        console.log(test);
                        return [4 /*yield*/, this.reservationRepository.search(roomid, startdate, enddate)];
                    case 2:
                        rep = _a.sent();
                        if (rep) {
                            return [2 /*return*/, Promise.resolve(1)];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return RoomService;
}(onecore_1.ViewSearchManager));
exports.RoomService = RoomService;
function useRoomController(log, db, mapper) {
    var queryRoom = (0, query_mappers_1.useQuery)('room', mapper, room_1.roomModel, true);
    var builder = new query_core_1.SearchBuilder(db.query, 'room', room_1.roomModel, db.driver, queryRoom);
    var repository = new query_core_1.Repository(db, 'room', room_1.roomModel);
    var reservationRepository = new SqlReservationRoomRepository(db, db.execBatch, 'startdate', 'enddate', 'roomid');
    var service = new RoomService(builder.search, repository, reservationRepository);
    return new RoomController(log, service);
}
exports.useRoomController = useRoomController;
var SqlReservationRoomRepository = /** @class */ (function (_super) {
    __extends(SqlReservationRoomRepository, _super);
    function SqlReservationRoomRepository(db, execute, startdate, enddate, roomid) {
        var _this = _super.call(this, db, 'reservation', room_1.reservationModel) || this;
        _this.db = db;
        _this.execute = execute;
        _this.startdate = startdate;
        _this.enddate = enddate;
        _this.roomid = roomid;
        _this.search = _this.search.bind(_this);
        return _this;
    }
    SqlReservationRoomRepository.prototype.search = function (roomid, startdate, enddate) {
        var check = "select ".concat(this.roomid, " from ").concat(this.table, " where ").concat(this.startdate, " = $1 and ").concat(this.enddate, " = $2 ");
        return this.db.query(check, [startdate, enddate]).then(function (room) {
            console.log(room);
            return room;
        });
    };
    return SqlReservationRoomRepository;
}(query_core_1.Repository));
exports.SqlReservationRoomRepository = SqlReservationRoomRepository;
//# sourceMappingURL=index.js.map