import { Attributes, buildToDelete, buildToInsert, DB, metadata, Repository, SqlLoader, Statement, StringMap } from 'query-core';
import { CommentFilter, CommentRepository, InfoRepository, Reaction, ReactionRepository } from './core-query';

export * from './core-query';

export const commentHistoryModel: Attributes = {
  comment: {
    length: 500
  },
  time: {
    type: 'datetime'
  }
};
export const commentModel: Attributes = {
  commentId: {
    key: true
  },
  id: {
    required: true,
    noupdate: true,
    match: 'equal'
  },
  author: {
    required: true,
    noupdate: true,
    match: 'equal'
  },
  userId: {
    required: true,
    noupdate: true,
    match: 'equal'
  },
  comment: {
    length: 500
  },
  time: {
    type: 'datetime',
    noupdate: true,
  },
  updatedAt: {
    type: 'datetime'
  },
  histories: {
    type: 'array',
    typeof: commentHistoryModel
  },
  anonymous: {
    type: 'boolean'
  }
};
export const rateReactionModel: Attributes = {
  id: {
    key: true,
    required: true
  },
  author: {
    key: true,
    required: true
  },
  userId: {
    key: true,
    required: true
  },
  time: {
    type: 'datetime',
  },
  reaction: {
    type: 'integer',
  }
};
export class SqlRepository<R> {
  constructor(public db: DB, public table: string, public attributes: Attributes, authorCol?: string, idField?: string, idCol?: string) {
    const m = metadata(attributes);
    this.map = m.map;
    this.idField = (idField && idField.length > 0 ? idField : 'id');
    this.authorCol = (authorCol && authorCol.length > 0 ? authorCol : 'author');
    if (idCol && idCol.length > 0) {
      this.idCol = idCol;
    } else {
      const c = attributes[this.idField];
      if (c) {
        this.idCol = (c.column && c.column.length > 0 ? c.column : this.idField);
      } else {
        this.idCol = this.idField;
      }
    }
    this.load = this.load.bind(this);
  }
  map?: StringMap;
  idField: string;
  idCol: string;
  authorCol: string;
  load(id: string, author: string, ctx?: any): Promise<R | null> {
    return this.db.query<R>(`select * from ${this.table} where ${this.idCol} = ${this.db.param(1)} and ${this.authorCol} = ${this.db.param(2)}`, [id, author], this.map, undefined, ctx).then(rates => {
      return rates && rates.length > 0 ? rates[0] : null;
    });
  }
}
// tslint:disable-next-line:max-classes-per-file
export class SqlInfoRepository<T> extends SqlLoader<T, string> implements InfoRepository<T> {
  constructor(public db: DB, table: string, attributes: Attributes, protected buildToSave: <K>(obj: K, table: string, attrs: Attributes, ver?: string, buildParam?: (i: number) => string, i?: number) => Statement | undefined) {
    super(db.query, table, attributes, db.param);
    this.save = this.save.bind(this);
  }
  async save(obj: T, ctx?: any): Promise<number> {
    const stmt = await this.buildToSave<T>(obj, this.table, this.attributes);
    if (stmt) {
      return this.db.exec(stmt.query, stmt.params, ctx);
    } else {
      return Promise.resolve(0);
    }
  }
}
// tslint:disable-next-line:max-classes-per-file
export class SqlCommentRepository<T> extends Repository<T, string> implements CommentRepository<T> {
  constructor(db: DB, table: string, attrs: Attributes, protected parent: string, idField?: string, authorField?: string, col?: string, author?: string, time?: string, id?: string, idCol?: string, authorCol?: string) {
    super(db, table, attrs);
    this.col = (col && col.length > 0 ? col : 'replycount');
    this.id = (id && id.length > 0 ? id : 'id');
    this.author = (author && author.length > 0 ? author : 'author');
    this.time = (time && time.length > 0 ? time : 'time');
    this.idField = (idField && idField.length > 0 ? idField : 'id');
    this.authorField = (authorField && authorField.length > 0 ? authorField : 'author');
    if (idCol && idCol.length > 0) {
      this.idCol = idCol;
    } else {
      const c = attrs[this.idField];
      if (c) {
        this.idCol = (c.column && c.column.length > 0 ? c.column : this.idField);
      } else {
        this.idCol = this.idField;
      }
    }
    if (authorCol && authorCol.length > 0) {
      this.authorCol = authorCol;
    } else {
      const c = attrs[this.authorField];
      if (c) {
        this.authorCol = (c.column && c.column.length > 0 ? c.column : this.authorField);
      } else {
        this.authorCol = this.authorField;
      }
    }
    this.insert = this.insert.bind(this);
    this.remove = this.remove.bind(this);
    this.getComments = this.getComments.bind(this);
  }
  col: string;
  id: string;
  author: string;
  time: string;
  protected idField: string;
  protected authorField: string;
  protected idCol: string;
  protected authorCol: string;
  insert(obj: T): Promise<number> {
    const stmt = buildToInsert(obj, this.table, this.attributes, this.param, this.version);
    if (stmt) {
      const query = `update ${this.parent} set ${this.col} = ${this.col} + 1 where ${this.id} = ${this.param(1)} and ${this.author} = ${this.param(2)}`;
      const ob: any = obj;
      const s2: Statement = { query, params: [ob[this.idField], ob[this.authorField]] };
      return this.execBatch([stmt, s2], true);
    } else {
      return Promise.resolve(0);
    }
  }
  remove(commentId: string, id: string, author: string): Promise<number> {
    const stmt = buildToDelete<string>(commentId, this.table, this.primaryKeys, this.param);
    if (stmt) {
      const query = `update ${this.parent} set ${this.col} = ${this.col} - 1 where ${this.id} = ${this.param(1)} and ${this.author} = ${this.param(2)}`;
      const s2: Statement = { query, params: [id, author] };
      return this.execBatch([stmt, s2]);
    } else {
      return Promise.resolve(0);
    }
  }
  getComments(id: string, author: string, limit?: number): Promise<T[]> {
    let sql = `select * from ${this.table} where ${this.idCol} = ${this.param(1)} and ${this.authorCol} = ${this.param(2)}`;
    if (limit && limit > 0) {
      sql = sql + ` order by ${this.time} desc limit ${limit}`;
    } else {
      sql = sql + ` order by ${this.time}`;
    }
    return this.query<T>(sql, [id, author], this.map).then(comments => {
      if (limit && limit > 0) {
        return revert<T>(comments);
      } else {
        return comments;
      }
    });
  }
}
export function revert<T>(arr: T[]): T[] {
  if (!arr || arr.length <= 1) {
    return arr;
  }
  const newArr: T[] = [];
  for (let i = arr.length - 1; i >= 0; i--) {
    newArr.push(arr[i]);
  }
  return newArr;
}
// tslint:disable-next-line:max-classes-per-file
export class SqlReactionRepository implements ReactionRepository {
  constructor(protected db: DB, protected table: string, protected attributes: Attributes,
    protected parent: string, col?: string, author?: string, id?: string, userIdCol?: string, authorCol?: string, idCol?: string) {
    this.col = (col && col.length > 0 ? col : 'usefulcount');
    this.parentId = (id && id.length > 0 ? id : 'id');
    this.parentAuthor = (author && author.length > 0 ? author : 'author');
    this.userIdCol = (userIdCol && userIdCol.length > 0 ? userIdCol : 'userId');
    this.idCol = (idCol && idCol.length > 0 ? idCol : this.parentId);
    this.authorCol = (authorCol && authorCol.length > 0 ? authorCol : this.parentAuthor);
    this.exist = this.exist.bind(this);
    this.save = this.save.bind(this);
    this.remove = this.remove.bind(this);
  }
  col: string;
  parentId: string;
  parentAuthor: string;
  idCol: string;
  authorCol: string;
  userIdCol: string;
  protected exist(id: string, author: string, userId: string): Promise<boolean> {
    return this.db.query<Reaction>(`select ${this.idCol} from ${this.table} where ${this.idCol} = ${this.db.param(1)} and ${this.authorCol} = ${this.db.param(2)} and ${this.userIdCol} = ${this.db.param(3)}`, [id, author, userId]).then(rates => {
      return rates && rates.length > 0 ? true : false;
    });
  }
  remove(id: string, author: string, userId: string): Promise<number> {
    const query1 = `delete from ${this.table} where ${this.idCol} = ${this.db.param(1)} and ${this.authorCol} = ${this.db.param(2)} and ${this.userIdCol}= ${this.db.param(3)}`;
    const s1: Statement = { query: query1, params: [id, author, userId] };
    const query2 = `update ${this.parent} set ${this.col} = ${this.col} - 1 where ${this.parentId} = ${this.db.param(1)} and ${this.parentAuthor} = ${this.db.param(2)}`;
    const s2: Statement = { query: query2, params: [id, author] };
    return this.db.execBatch([s1, s2], true);
  }
  save(id: string, author: string, userId: string, reaction: number): Promise<number> {
    const obj: Reaction = { id, userId, author, time: new Date(), reaction };
    const stmt = buildToInsert(obj, this.table, this.attributes, this.db.param);
    if (stmt) {
      return this.exist(id, author, userId).then(ok => {
        if (ok === false) {
          const query = `update ${this.parent} set ${this.col} = ${this.col} + 1 where ${this.parentId} = ${this.db.param(1)} and ${this.parentAuthor} = ${this.db.param(2)}`;
          const s2: Statement = { query, params: [id, author] };
          return this.db.execBatch([stmt, s2]);
        } else {
          return Promise.resolve(0);
        }
      });
    } else {
      return Promise.resolve(0);
    }
  }
}
export interface Info {
  id: string;
  url?: string;
  name?: string
  displayname?: string
}
export interface SearchResult<T> {
  list: T[];
  total?: number;
  last?: boolean;
  nextPageToken?: string;
}
export type Search<T, F> = (s: F, limit?: number, offset?: number | string, fields?: string[]) => Promise<SearchResult<T>>;
export interface BaseComment {
  userId: string;
  userURL?: string;
  authorURL?: string;
  authorName?: string;
}
export interface CommentsRepository<T> {
  load(commentId: string, ctx?: any): Promise<T | null>;
  getComments(id: string, author: string, limit?: number): Promise<T[]>;
}
// tslint:disable-next-line:max-classes-per-file
export class BaseCommentQuery<T extends BaseComment> {
  constructor(protected repository: CommentsRepository<T>, protected queryInfo?: (ids: string[]) => Promise<Info[]>) {
    this.load = this.load.bind(this);
    this.getComment = this.getComment.bind(this);
    this.getComments = this.getComments.bind(this);
  }
  getComment(id: string, ctx?: any): Promise<T | null> {
    return this.load(id, ctx);
  }
  load(id: string, ctx?: any): Promise<T | null> {
    return this.repository.load(id, ctx).then(comment => {
      if (comment && this.queryInfo) {
        return this.queryInfo([id]).then(info => {
          const i = binarySearch(info, comment.userId);
          if (i >= 0) {
            comment.userURL = info[i].url;
            comment.authorName = info[i].displayname ? info[i].displayname : info[i].name
          }
          return comment;
        });
      } else {
        return comment;
      }
    });
  }
  getComments(id: string, author: string, limit?: number): Promise<T[]> {
    return this.repository.getComments(id, author, limit).then(comments => {
      if (this.queryInfo) {
        const ids: string[] = [];
        for (const comment of comments) {
          ids.push(comment.userId);
        }
        return this.queryInfo(ids).then(info => {
          for (const comment of comments) {
            const i = binarySearch(info, comment.userId);
            if (i >= 0) {
              comment.userURL = info[i].url;
              comment.authorName = info[i].displayname ? info[i].displayname : info[i].name
            }
          }
          return comments;
        });
      } else {
        return comments;
      }
    });
  }
}
// tslint:disable-next-line:max-classes-per-file
export class CommentQuery<T extends BaseComment, F> extends BaseCommentQuery<T> {
  constructor(protected find: Search<T, F>, repository: CommentsRepository<T>, queryInfo?: (ids: string[]) => Promise<Info[]>) {
    super(repository, queryInfo);
    this.search = this.search.bind(this);
  }
  search(s: F, limit?: number, offset?: number | string, fields?: string[]): Promise<SearchResult<T>> {
    return this.find(s, limit, offset, fields).then(res => {
      if (!this.queryInfo) {
        return res;
      } else {
        if (res.list && res.list.length > 0) {
          const ids: string[] = [];
          for (const rate of res.list) {
            if (!ids.includes(rate.userId)) {
              ids.push(rate.userId);
            }
          }
          return this.queryInfo(ids).then(info => {
            for (const rate of res.list) {
              const i = binarySearch(info, rate.userId);
              if (i >= 0) {
                rate.userURL = info[i].url;
                rate.authorName = info[i].displayname ? info[i].displayname : info[i].name
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
