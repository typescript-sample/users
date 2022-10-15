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
exports.useBackOfficeJobController = exports.BackOfficeJobController = exports.JobManager = void 0;
var express_ext_1 = require("express-ext");
var onecore_1 = require("onecore");
var query_core_1 = require("query-core");
var query_mappers_1 = require("query-mappers");
var job_1 = require("./job");
var JobManager = /** @class */ (function (_super) {
    __extends(JobManager, _super);
    function JobManager(search, repository) {
        return _super.call(this, search, repository) || this;
    }
    return JobManager;
}(onecore_1.Manager));
exports.JobManager = JobManager;
var BackOfficeJobController = /** @class */ (function (_super) {
    __extends(BackOfficeJobController, _super);
    function BackOfficeJobController(log, jobService) {
        return _super.call(this, log, jobService) || this;
    }
    return BackOfficeJobController;
}(express_ext_1.Controller));
exports.BackOfficeJobController = BackOfficeJobController;
function useBackOfficeJobController(log, db, mapper) {
    var query = (0, query_mappers_1.useQuery)('job', mapper, job_1.jobModel, true);
    var builder = new query_core_1.SearchBuilder(db.query, 'job', job_1.jobModel, db.driver, query);
    var repository = new query_core_1.Repository(db, 'job', job_1.jobModel);
    var service = new JobManager(builder.search, repository);
    return new BackOfficeJobController(log, service);
}
exports.useBackOfficeJobController = useBackOfficeJobController;
//# sourceMappingURL=index.js.map