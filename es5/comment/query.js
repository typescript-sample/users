"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildQuery = void 0;
function buildQuery(s) {
    var query = "select * from comments";
    var where = [];
    var params = [];
    var i = 1;
    if (s.id && s.id.length > 0) {
        where.push("id = $".concat(i++));
        params.push(s.id);
    }
    if (s.author && s.author.length > 0) {
        where.push("author = $".concat(i++));
        params.push(s.author);
    }
    if (where.length > 0) {
        query = query + " where " + where.join(' and ');
    }
    if (s.limit && s.limit > 0) {
        query = query + " limit ".concat(s.limit);
    }
    return { query: query, params: params };
}
exports.buildQuery = buildQuery;
//# sourceMappingURL=query.js.map