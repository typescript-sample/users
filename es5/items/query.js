"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildQuery = void 0;
function buildQuery(s) {
    var e_1, _a;
    var query = "select * from item";
    var where = [];
    var params = [];
    var i = 1;
    if (s.id && s.id.length > 0) {
        where.push("id = $".concat(i++));
        params.push(s.id);
    }
    if (s.title && s.title.length > 0) {
        where.push("title ilike $".concat(i++));
        params.push('%' + s.title + '%');
    }
    if (s.status && s.status.length > 0) {
        where.push("status ilike $".concat(i++));
        params.push('%' + s.status + '%');
    }
    if (s.description && s.description.length > 0) {
        where.push("description ilike $".concat(i++));
        params.push('%' + s.description + '%');
    }
    if (s.categories && s.categories.length > 0) {
        params.push(s.categories);
        where.push("categories && $".concat(i++));
    }
    if (s.brand && s.brand.length > 0) {
        var brand = [];
        try {
            for (var _b = __values(s.brand), _c = _b.next(); !_c.done; _c = _b.next()) {
                var b = _c.value;
                brand.push("brand = $".concat(i++));
                params.push(b);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        where.push("(".concat(brand.join(' or '), ")"));
    }
    if (s.price) {
        if (s.price.min && s.price.max) {
            where.push("price >= $".concat(i++, " and price <= $").concat(i++));
            params.push(s.price.min);
            params.push(s.price.max);
        }
        else if (s.price.min) {
            where.push("price >= $".concat(i++));
            params.push(s.price.min);
        }
        else if (s.price.max) {
            where.push("price <= $".concat(i++));
            params.push(s.price.max);
        }
    }
    if (where.length > 0) {
        query = query + " where " + where.join(' and ');
    }
    if (s.sort) {
        query = query + " order by ".concat(s.sort);
    }
    return { query: query, params: params };
}
exports.buildQuery = buildQuery;
//# sourceMappingURL=query.js.map