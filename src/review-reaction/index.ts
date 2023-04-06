import { BaseRepository, Comment, CommentRepository, Model, ReactionRepository, ShortComment } from './comment';
import { Attributes, Search, SearchResult } from './core';

export * from './comment';

export interface Info {
  id: string;
  url?: string;
  name?: string
  displayname?: string
}
export class ReactionService<R extends Model, F> {
  constructor(protected find: Search<R, F>,
    public repository: BaseRepository<R>,
    protected reactionRepository: ReactionRepository,
    protected commentRepository: CommentRepository,
    protected queryInfo?: (ids: string[]) => Promise<Info[]>) {
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
  search(s: F, limit?: number, offset?: number | string, fields?: string[]): Promise<SearchResult<R>> {
    return this.find(s, limit, offset, fields).then(res => {
      if (!this.queryInfo) {
        return res;
      } else {
        if (res.list && res.list.length > 0) {
          const ids: string[] = [];
          for (const rate of res.list) {
            if (!ids.includes(rate.author)) {
              ids.push(rate.author);
            }
          }
          return this.queryInfo(ids).then(info => {
            for (const rate of res.list) {
              const i = binarySearch(info, rate.author);
              if (i >= 0 && !rate.anonymous) {
                rate.authorURL = info[i].url;
                rate.authorName = info[i].displayname ? info[i].displayname : info[i].name;
              }
            }
            return res;
          });
        } else {
          return res;
        }
      }
    });
  }
  load(id: string, author: string): Promise<R | null> {
    return this.repository.load(id, author);
  }
  getRate(id: string, author: string): Promise<R | null> {
    return this.repository.load(id, author);
  }
  setUseful(id: string, author: string, userId: string): Promise<number> {
    return this.reactionRepository.save(id, author, userId, 1);
  }
  removeUseful(id: string, author: string, userId: string): Promise<number> {
    return this.reactionRepository.remove(id, author, userId);
  }
  comment(comment: Comment): Promise<number> {
    return this.repository.load(comment.id, comment.author).then(checkRate => {
      if (!checkRate) {
        return -1;
      } else {
        comment.time ? comment.time = comment.time : comment.time = new Date();
        return this.commentRepository.insert(comment);
      }
    });
  }
  removeComment(commentId: string, userId: string): Promise<number> {
    return this.commentRepository.load(commentId).then(comment => {
      if (comment) {
        if (userId === comment.author || userId === comment.userId) {
          return this.commentRepository.remove(commentId, comment.id, comment.author);
        } else {
          return -2;
        }
      } else {
        return -1;
      }
    });
  }
  updateComment(comment: Comment): Promise<number> {
    return this.commentRepository.load(comment.commentId).then(exist => {
      if (!exist) {
        return -1;
      } else {
        if (exist.userId !== comment.userId) {
          return -2;
        }
        exist.updatedAt = new Date();
        const c: ShortComment = { comment: exist.comment, time: exist.time };
        if (exist.histories && exist.histories.length > 0) {
          exist.histories.push(c);
        } else {
          exist.histories = [c];
        }
        exist.comment = comment.comment;
        const res = this.commentRepository.update(exist);
        return res;
      }
    });
  }
  getComments(id: string, author: string, limit?: number): Promise<Comment[]> {
    return this.commentRepository.getComments(id, author, limit).then(comments => {
      if (this.queryInfo) {
        const ids: string[] = [];
        for (const comment of comments) {
          if (!ids.includes(comment.userId)) {
            ids.push(comment.userId);
          }
        }
        return this.queryInfo(ids).then(info => {
          for (const comment of comments) {
            const i = binarySearch(info, comment.userId);
            if (i >= 0 && !comment.anonymous) {
              comment.authorURL = info[i].url;
              comment.authorName = info[i].displayname ? info[i].displayname : info[i].name;
            }
          }
          return comments;
        });
      } else {
        return comments;
      }
    });
  }
  getComment(id: string): Promise<Comment | null> {
    return this.commentRepository.load(id).then(comment => {
      if (comment && this.queryInfo) {
        return this.queryInfo([id]).then(info => {
          const i = binarySearch(info, comment.userId);
          if (i >= 0 && !comment.anonymous) {
            comment.authorURL = info[i].url;
            comment.authorName = info[i].displayname ? info[i].displayname : info[i].name;
          }
          return comment;
        });
      } else {
        return comment;
      }
    });
  }
}
export interface BaseCommentRepository {
  load(commentId: string, ctx?: any): Promise<Comment | null>;
  getComments(id: string, author: string, limit?: number): Promise<Comment[]>;
}
function binarySearch(ar: Info[], el: string): number {
  let m = 0;
  let n = ar.length - 1;
  while (m <= n) {
    // tslint:disable-next-line:no-bitwise
    const k = (n + m) >> 1;
    const cmp = compare(el, ar[k].id);
    if (cmp > 0) {
      m = k + 1;
    } else if (cmp < 0) {
      n = k - 1;
    } else {
      return k;
    }
  }
  return -m - 1;
}
function compare(s1: string, s2: string): number {
  return s1.localeCompare(s2);
}
interface ErrorMessage {
  field: string;
  code: string;
  param?: string | number | Date;
  message?: string;
}
// tslint:disable-next-line:max-classes-per-file
export class CommentValidator {
  constructor(protected attributes: Attributes, protected check: (obj: any, attributes: Attributes) => ErrorMessage[]) {
    this.validate = this.validate.bind(this);
  }
  validate(comment: Comment): Promise<ErrorMessage[]> {
    const errs = this.check(comment, this.attributes);
    return Promise.resolve(errs);
  }
}
