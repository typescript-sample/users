"use strict";
function __export(m) {
  for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./comment"));
var ReactionService = (function () {
  function ReactionService(find, repository, reactionRepository, commentRepository, queryURL) {
    this.find = find;
    this.repository = repository;
    this.reactionRepository = reactionRepository;
    this.commentRepository = commentRepository;
    this.queryURL = queryURL;
    this.search = this.search.bind(this);
    this.load = this.load.bind(this);
    this.getRate = this.getRate.bind(this);
    this.setUseful = this.setUseful.bind(this);
    this.removeUseful = this.removeUseful.bind(this);
    this.comment = this.comment.bind(this);
    this.removeComment = this.removeComment.bind(this);
    this.updateComment = this.updateComment.bind(this);
    this.getComments = this.getComments.bind(this);
    this.getComment = this.getComment.bind(this);
  }
  ReactionService.prototype.search = function (s, limit, offset, fields) {
    var _this = this;
    return this.find(s, limit, offset, fields).then(function (res) {
      if (!_this.queryURL) {
        return res;
      }
      else {
        if (res.list && res.list.length > 0) {
          var ids = [];
          for (var _i = 0, _a = res.list; _i < _a.length; _i++) {
            var rate = _a[_i];
            ids.push(rate.author);
          }
          return _this.queryURL(ids).then(function (urls) {
            for (var _i = 0, _a = res.list; _i < _a.length; _i++) {
              var rate = _a[_i];
              var i = binarySearch(urls, rate.author);
              if (i >= 0) {
                rate.authorURL = urls[i].url;
              }
            }
            return res;
          });
        }
        else {
          return res;
        }
      }
    });
  };
  ReactionService.prototype.load = function (id, author) {
    return this.repository.load(id, author);
  };
  ReactionService.prototype.getRate = function (id, author) {
    return this.repository.load(id, author);
  };
  ReactionService.prototype.setUseful = function (id, author, userId) {
    return this.reactionRepository.save(id, author, userId, 1);
  };
  ReactionService.prototype.removeUseful = function (id, author, userId) {
    return this.reactionRepository.remove(id, author, userId);
  };
  ReactionService.prototype.comment = function (comment) {
    var _this = this;
    return this.repository.load(comment.id, comment.author).then(function (checkRate) {
      if (!checkRate) {
        return -1;
      }
      else {
        comment.time ? comment.time = comment.time : comment.time = new Date();
        return _this.commentRepository.insert(comment);
      }
    });
  };
  ReactionService.prototype.removeComment = function (commentId, userId) {
    var _this = this;
    return this.commentRepository.load(commentId).then(function (comment) {
      if (comment) {
        if (userId === comment.author || userId === comment.userId) {
          return _this.commentRepository.remove(commentId, comment.id, comment.author);
        }
        else {
          return -2;
        }
      }
      else {
        return -1;
      }
    });
  };
  ReactionService.prototype.updateComment = function (comment) {
    var _this = this;
    return this.commentRepository.load(comment.commentId).then(function (exist) {
      if (!exist) {
        return -1;
      }
      else {
        if (exist.userId !== comment.userId) {
          return -2;
        }
        exist.updatedAt = new Date();
        var c = { comment: exist.comment, time: exist.time };
        if (exist.histories && exist.histories.length > 0) {
          exist.histories.push(c);
        }
        else {
          exist.histories = [c];
        }
        exist.comment = comment.comment;
        var res = _this.commentRepository.update(exist);
        return res;
      }
    });
  };
  ReactionService.prototype.getComments = function (id, author, limit) {
    var _this = this;
    return this.commentRepository.getComments(id, author, limit).then(function (comments) {
      if (_this.queryURL) {
        var ids = [];
        for (var _i = 0, comments_1 = comments; _i < comments_1.length; _i++) {
          var comment = comments_1[_i];
          ids.push(comment.userId);
        }
        return _this.queryURL(ids).then(function (urls) {
          for (var _i = 0, comments_2 = comments; _i < comments_2.length; _i++) {
            var comment = comments_2[_i];
            var i = binarySearch(urls, comment.userId);
            if (i >= 0) {
              comment.userURL = urls[i].url;
            }
          }
          return comments;
        });
      }
      else {
        return comments;
      }
    });
  };
  ReactionService.prototype.getComment = function (id) {
    var _this = this;
    return this.commentRepository.load(id).then(function (comment) {
      if (comment && _this.queryURL) {
        return _this.queryURL([id]).then(function (urls) {
          var i = binarySearch(urls, comment.userId);
          if (i >= 0) {
            comment.userURL = urls[i].url;
          }
          return comment;
        });
      }
      else {
        return comment;
      }
    });
  };
  return ReactionService;
}());
exports.ReactionService = ReactionService;
function binarySearch(ar, el) {
  var m = 0;
  var n = ar.length - 1;
  while (m <= n) {
    var k = (n + m) >> 1;
    var cmp = compare(el, ar[k].id);
    if (cmp > 0) {
      m = k + 1;
    }
    else if (cmp < 0) {
      n = k - 1;
    }
    else {
      return k;
    }
  }
  return -m - 1;
}
function compare(s1, s2) {
  return s1.localeCompare(s2);
}
var CommentValidator = (function () {
  function CommentValidator(attributes, check) {
    this.attributes = attributes;
    this.check = check;
    this.validate = this.validate.bind(this);
  }
  CommentValidator.prototype.validate = function (comment) {
    var errs = this.check(comment, this.attributes);
    return Promise.resolve(errs);
  };
  return CommentValidator;
}());
exports.CommentValidator = CommentValidator;
