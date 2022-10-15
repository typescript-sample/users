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
    var query = "select * from users";
    var where = [];
    var params = [];
    var i = 1;
    if (s.interests && s.interests.length > 0) {
        params.push(s.interests);
        where.push("interests && $".concat(i++));
    }
    if (s.skills && s.skills.length > 0) {
        var skills = [];
        try {
            for (var _b = __values(s.skills), _c = _b.next(); !_c.done; _c = _b.next()) {
                var skill = _c.value;
                skills.push("$".concat(i++, " <@ ANY(skills)"));
                params.push(skill);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        where.push("(".concat(skills.join(' or '), ")"));
    }
    if (s.dateOfBirth) {
        if (s.dateOfBirth.min) {
            where.push("date_of_birth >= $".concat(i++));
            params.push(s.dateOfBirth.min);
        }
        if (s.dateOfBirth.max) {
            where.push("date_of_birth <= $".concat(i++));
            params.push(s.dateOfBirth.max);
        }
    }
    if (s.id && s.id.length > 0) {
        where.push("id = $".concat(i++));
        params.push(s.id);
    }
    if (s.username && s.username.length > 0) {
        where.push("username ilike $".concat(i++));
        params.push('%' + s.username + '%');
    }
    if (s.email && s.email.length > 0) {
        where.push("email ilike $".concat(i++));
        params.push(s.email + '%');
    }
    if (s.phone && s.phone.length > 0) {
        where.push("username ilike $".concat(i++));
        params.push('%' + s.phone + '%');
    }
    /*
    if (s.settings) {
      params.push(s.settings);
      where.push(`settings @> $${i++}`);
    }
    if (s.achievements && s.achievements.length > 0) {
      const achievements = [];
      for (const achievement of s.achievements) {
        achievements.push(`$${i++} <@ ANY(achievements)`);
        params.push(achievement);
      }
      where.push(`(${achievements.join(' or ')})`);
    }
    */
    if (where.length > 0) {
        query = query + " where " + where.join(' and ');
    }
    if (s.limit && s.limit > 0) {
        query = query + " limit ".concat(s.limit);
    }
    console.log(query);
    return { query: query, params: params };
}
exports.buildQuery = buildQuery;
// CREATE INDEX interests_index ON users (interests);
// db.Query(`select interests from users where interests && $1 and skills && $2`, [ 'Basketball', 'Kapp' ])
//# sourceMappingURL=query.js.map