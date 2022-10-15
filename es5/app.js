"use strict";
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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var config_plus_1 = require("config-plus");
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var dotenv_1 = __importDefault(require("dotenv"));
var express_1 = __importStar(require("express"));
var express_ext_1 = require("express-ext");
var http_1 = __importDefault(require("http"));
var logger_core_1 = require("logger-core");
var pg_1 = require("pg");
var pg_extension_1 = require("pg-extension");
var query_core_1 = require("query-core");
var query_mappers_1 = require("query-mappers");
var config_1 = require("./config");
var context_1 = require("./context");
var route_1 = require("./route");
dotenv_1.default.config();
var conf = (0, config_plus_1.merge)(config_1.config, process.env, config_1.env, process.env.ENV);
var logger = (0, logger_core_1.createLogger)(conf.log);
var middleware = new express_ext_1.MiddlewareLogger(logger.info, conf.middleware);
var app = (0, express_1.default)();
app.use((0, express_ext_1.allow)(conf.allow), (0, express_1.json)(), (0, cookie_parser_1.default)(), middleware.log);
var templates = (0, express_ext_1.loadTemplates)(conf.template, query_mappers_1.buildTemplates, query_mappers_1.trim, [
    './configs/appreciation.xml',
    './configs/article.xml',
    './configs/cinema.xml',
    './configs/comment.xml',
    './configs/company.xml',
    './configs/film.xml',
    './configs/item.xml',
    './configs/job.xml',
    './configs/location.xml',
    './configs/user.xml',
    './configs/music.xml',
    './configs/room.xml',
]);
var db = (0, query_core_1.log)(new pg_extension_1.PoolManager(new pg_1.Pool(conf.db.user)), true, logger, 'postgres');
var pool = new pg_1.Pool(conf.db.query);
var queryDB = new pg_extension_1.PoolManager(pool);
var ctx = (0, context_1.useContext)(db, queryDB, logger, middleware, conf, templates);
(0, route_1.route)(app, ctx);
http_1.default.createServer(app).listen(conf.port, function () {
    console.log('Start server at port ' + conf.port);
});
//# sourceMappingURL=app.js.map