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
exports.usePlaylistController = exports.PlaylistManager = exports.PlaylistController = exports.useSavedListSongController = exports.useSavedMusicsController = exports.useMusicController = exports.MusicService = void 0;
var express_ext_1 = require("express-ext");
var onecore_1 = require("onecore");
var pg_extension_1 = require("pg-extension");
var query_core_1 = require("query-core");
var query_mappers_1 = require("query-mappers");
var music_1 = require("./music");
var MusicService = /** @class */ (function (_super) {
    __extends(MusicService, _super);
    function MusicService(search, repository, saveItemsRepository, max) {
        var _this = _super.call(this, search, repository) || this;
        _this.repository = repository;
        _this.saveItemsRepository = saveItemsRepository;
        _this.max = max;
        return _this;
    }
    return MusicService;
}(onecore_1.ViewSearchManager));
exports.MusicService = MusicService;
function useMusicController(log, db, mapper) {
    var savedMusicMax = 50;
    var query = (0, query_mappers_1.useQuery)('music', mapper, music_1.musicModel, true);
    var builder = new query_core_1.SearchBuilder(db.query, 'music', music_1.musicModel, db.driver, query);
    var repository = new query_core_1.Repository(db, 'music', music_1.musicModel);
    var saveMusicRepository = new pg_extension_1.ArrayRepository(db.query, db.exec, 'savedmusic', 'songs', 'id');
    var service = new MusicService(builder.search, repository, saveMusicRepository, savedMusicMax);
    return new express_ext_1.QueryController(log, service);
}
exports.useMusicController = useMusicController;
function useSavedMusicsController(log, db) {
    var savedRepository = new pg_extension_1.ArrayRepository(db.query, db.exec, 'savedmusic', 'songs', 'id');
    var repository = new query_core_1.QueryRepository(db, 'music', music_1.musicModel);
    var service = new onecore_1.SavedService(savedRepository, repository.query, 50);
    return new express_ext_1.SavedController(log, service, 'itemId', 'id');
}
exports.useSavedMusicsController = useSavedMusicsController;
function useSavedListSongController(log, db) {
    var savedRepository = new pg_extension_1.ArrayRepository(db.query, db.exec, 'listsong', 'songs', 'id');
    var repository = new query_core_1.QueryRepository(db, 'music', music_1.musicModel);
    var service = new onecore_1.SavedService(savedRepository, repository.query, 50);
    return new express_ext_1.SavedController(log, service, 'itemId', 'id');
}
exports.useSavedListSongController = useSavedListSongController;
var PlaylistController = /** @class */ (function (_super) {
    __extends(PlaylistController, _super);
    function PlaylistController(log, musicService) {
        var _this = _super.call(this, log, musicService) || this;
        _this.musicService = musicService;
        return _this;
    }
    return PlaylistController;
}(express_ext_1.Controller));
exports.PlaylistController = PlaylistController;
var PlaylistManager = /** @class */ (function (_super) {
    __extends(PlaylistManager, _super);
    function PlaylistManager(search, repository) {
        return _super.call(this, search, repository) || this;
    }
    return PlaylistManager;
}(onecore_1.Manager));
exports.PlaylistManager = PlaylistManager;
function usePlaylistController(log, db, mapper) {
    var query = (0, query_mappers_1.useQuery)('playlist', mapper, music_1.playlistModel, true);
    var builder = new query_core_1.SearchBuilder(db.query, 'playlist', music_1.playlistModel, db.driver, query);
    var repository = new query_core_1.Repository(db, 'playlist', music_1.playlistModel);
    var service = new PlaylistManager(builder.search, repository);
    return new PlaylistController(log, service);
}
exports.usePlaylistController = usePlaylistController;
//# sourceMappingURL=index.js.map