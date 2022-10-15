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
exports.useJobController = exports.JobController = exports.JobService = void 0;
var express_ext_1 = require("express-ext");
var onecore_1 = require("onecore");
var query_core_1 = require("query-core");
var query_mappers_1 = require("query-mappers");
var job_1 = require("./job");
var JobService = /** @class */ (function (_super) {
    __extends(JobService, _super);
    function JobService(search, repository) {
        return _super.call(this, search, repository) || this;
    }
    return JobService;
}(onecore_1.ViewSearchManager));
exports.JobService = JobService;
var JobController = /** @class */ (function (_super) {
    __extends(JobController, _super);
    function JobController(log, jobService) {
        return _super.call(this, log, jobService) || this;
    }
    return JobController;
}(express_ext_1.QueryController));
exports.JobController = JobController;
function useJobController(log, db, mapper) {
    var query = (0, query_mappers_1.useQuery)('job', mapper, job_1.jobModel, true);
    var builder = new query_core_1.SearchBuilder(db.query, 'job', job_1.jobModel, db.driver, query);
    var repository = new query_core_1.Repository(db, 'job', job_1.jobModel);
    var service = new JobService(builder.search, repository);
    return new JobController(log, service);
}
exports.useJobController = useJobController;
//# sourceMappingURL=index.js.map