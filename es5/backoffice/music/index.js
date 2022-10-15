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
exports.generate = exports.useBackOfficeMusicController = exports.MusicManager = void 0;
var express_ext_1 = require("express-ext");
var onecore_1 = require("onecore");
var query_core_1 = require("query-core");
var query_mappers_1 = require("query-mappers");
var shortid_1 = __importDefault(require("shortid"));
var music_1 = require("./music");
var MusicManager = /** @class */ (function (_super) {
    __extends(MusicManager, _super);
    function MusicManager(search, repository) {
        return _super.call(this, search, repository) || this;
    }
    return MusicManager;
}(onecore_1.Manager));
exports.MusicManager = MusicManager;
function useBackOfficeMusicController(log, db, mapper) {
    var query = (0, query_mappers_1.useQuery)('music', mapper, music_1.musicModel, true);
    var builder = new query_core_1.SearchBuilder(db.query, 'music', music_1.musicModel, db.driver, query);
    var repository = new query_core_1.Repository(db, 'music', music_1.musicModel);
    var service = new MusicManager(builder.search, repository);
    return new express_ext_1.Controller(log, service);
}
exports.useBackOfficeMusicController = useBackOfficeMusicController;
function generate() {
    return shortid_1.default.generate();
}
exports.generate = generate;
//# sourceMappingURL=index.js.map