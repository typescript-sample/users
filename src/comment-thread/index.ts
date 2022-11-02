import { Request, Response } from "express";
import { buildArray, ErrorMessage, format, fromRequest, getParameters, handleError, jsonResult, Log, SearchResult } from "express-ext";
import { Search, ViewSearchManager } from "onecore";
import { Statement } from "pg-extension";
import { Attributes, buildMap, buildToDelete, buildToInsert, buildToUpdate, DB, Repository, StringMap } from "query-core";
import { CommentThread, CommentThreadFilter, CommentThreadReply, CommentThreadService, ShortComment, SqlCommentThreadReplyRepository, SqlCommentThreadRepository, SqlInfoCommentThreadRepository } from "./comment-thread";
export * from './comment-thread'
export class CommentThreadValidator {
    constructor(protected attributes: Attributes, protected check: (obj: any, attributes: Attributes) => ErrorMessage[]) {
        this.validate = this.validate.bind(this);
    }
    validate(comment: CommentThread): Promise<ErrorMessage[]> {
        const errs = this.check(comment, this.attributes);
        return Promise.resolve(errs);
    }
}
export class CommentThreadController<R> implements CommentThreadController<R> {
    protected commentIdCol: string
    protected idCol: string
    protected authorCol: string
    protected commentCol: string
    protected userIdCol: string

    protected commentThreadIdCol: string
    constructor(protected log: Log, protected commentThreadService: CommentThreadService, public commentThreadValidator: CommentThreadValidator,
        commentIdCol: string, idCol: string, authorCol: string, userIdCol: string, commentCol: string, commentThreadIdCol: string, private generate: () => string) {

        this.idCol = idCol;
        this.commentIdCol = commentIdCol;
        this.authorCol = authorCol;
        this.commentCol = commentCol;
        this.userIdCol = userIdCol ?? "userId";
        this.commentThreadIdCol = commentThreadIdCol ?? "commentThreadId"
        this.comment = this.comment.bind(this);
        this.remove = this.remove.bind(this);
        this.updateComment = this.updateComment.bind(this);
        this.search = this.search.bind(this);
        this.reply = this.reply.bind(this);
        this.getReplyComments = this.getReplyComments.bind(this)
    }

    search(req: Request, res: Response): void {
        const s = fromRequest<R>(req, buildArray(undefined, 'field'));
        const l = getParameters(s);
        const s2: any = format(s);
        if (req.params[this.idCol] && req.params[this.idCol].length > 0) {
            s2[this.idCol] = req.params[this.idCol]
        }

        this.commentThreadService.search(s2, l.limit, l.skipOrRefId, l.fields)
            .then(result => jsonResult(res, result, false, l.fields))
            .catch(err => handleError(err, res, this.log))
    }
    comment(req: Request, res: Response) {
        const id = req.params['id']
        const author = req.params['author']
        const commentId = this.generate()
        const comment: any = req.body
        comment[this.idCol] = id
        comment[this.authorCol] = author
        comment[this.commentIdCol] = commentId
        this.commentThreadService.comment(comment).then((rep) => {
            return res.status(200).json(rep).end()
        }).catch((error) => {
            handleError(error, res, this.log)
        })
    }
    remove(req: Request, res: Response) {
        this.commentThreadService.remove(req.params[this.commentIdCol]).then(rep => {
            return res.status(200).json(rep).end()
        }).catch((error) => {
            handleError(error, res, this.log)
        })
    }

    updateComment(req: Request, res: Response) {
        const comment = req.body
        comment[this.commentIdCol] = req.params[this.commentIdCol]
        this.commentThreadService.updateComment(comment).then(rep => {
            return res.status(200).json(rep).end()
        }).catch((error) => {
            handleError(error, res, this.log)
        })
    }

    reply(req: Request, res: Response) {
        const comment = req.body
        comment[this.commentThreadIdCol] = req.params[this.commentThreadIdCol]
        comment[this.authorCol] = req.params[this.authorCol]
        comment[this.idCol] = req.params[this.idCol]
        comment[this.commentIdCol] = this.generate()
        // const commentThreadId = req.params[]
        this.commentThreadService.replyComment(comment).then(rep => {
            return res.status(200).json(rep).end()
        }).catch((error) => {
            handleError(error, res, this.log)
        })
    }
    getReplyComments(req: Request, res: Response) {
        this.commentThreadService.getReplyComments(req.params[this.commentThreadIdCol])
            .then(result => res.status(200).json(result).end())
            .catch(error => handleError(error, res, this.log))
    }
}
export interface URL {
    id: string;
    url: string;
}
function compare(s1: string, s2: string): number {
    return s1.localeCompare(s2);
}
function binarySearch(ar: URL[], el: string): number {
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
export class CommentThreadClient implements CommentThreadService {
    constructor(
        protected find: Search<CommentThread, CommentThreadFilter>,
        protected commentThreadRepository: SqlCommentThreadRepository<CommentThread>,
        protected commentThreadReplyRepository: SqlCommentThreadReplyRepository,
        protected queryURL?: (ids: string[]) => Promise<URL[]>
    ) {
        this.search = this.search.bind(this)
        this.comment = this.comment.bind(this)
        this.remove = this.remove.bind(this)
        this.replyComment = this.replyComment.bind(this)
        this.updateComment = this.updateComment.bind(this)
    }
    getReplyComments(commentThreadId: string): Promise<CommentThreadReply[]> {
        return this.commentThreadReplyRepository.getComments(commentThreadId)
    }
    replyComment(obj: CommentThreadReply): Promise<number> {
        return this.commentThreadReplyRepository.replyComment(obj)
    }
    search(s: CommentThreadFilter, limit?: number, offset?: number | string, fields?: string[]): Promise<SearchResult<CommentThread>> {
        return this.find(s, limit, offset, fields).then(res => {
            console.log(res);
            
            if (!this.queryURL) {
                return res;
            } else {
                if (res.list && res.list.length > 0) {
                    const ids: string[] = [];
                    for (const rate of res.list) {
                        ids.push(rate.author);
                    }
                    return this.queryURL(ids).then(urls => {
                        for (const rate of res.list) {
                            const i = binarySearch(urls, rate.author);
                            if (i >= 0) {
                                rate.authorURL = urls[i].url;
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
    comment(comment: CommentThread): Promise<number> {
        comment.time = comment.time ?? new Date()
        return this.commentThreadRepository.insert(comment)
    }
    async remove(commentId: string): Promise<number> {
        const obj = await this.commentThreadRepository.load(commentId);
        if (obj) {
            return this.commentThreadRepository.remove(commentId);
        } else {
            return Promise.resolve(0);
        }
    }
    async updateComment(comment: CommentThread): Promise<number> {
        const exist = await this.commentThreadRepository.load(comment.commentid);

        if (!exist)
            return -1;
        if (exist.commentid != comment.commentid) {
            return -1;
        }
        exist.updatedAt = new Date();
        const c: ShortComment = { comment: exist.commentid, time: exist.time };
        if (exist.histories && exist.histories.length > 0) {
            exist.histories.push(c);
        } else {
            exist.histories = [c];
        }
        exist.comment = comment.comment;
        const res = this.commentThreadRepository.updateComment(exist);
        return res;
    }
}

export class CommentThreadRepository
    extends Repository<CommentThread, string>
    implements SqlCommentThreadRepository<CommentThread> {
    constructor(protected db: DB, table: string, attributes: Attributes,
        commentIdCol?: string, idCol?: string, authorCol?: string, commentCol?: string, timeCol?: string) {
        super(db, table, attributes)
        this.commentIdCol = commentIdCol ?? "commentid";
        this.idCol = idCol ?? "id";
        this.authorCol = authorCol ?? "author";
        this.commentCol = commentCol ?? "comment";
        this.timeCol = timeCol ?? "time";
        this.mapper = buildMap(this.attributes)
        this.insert = this.insert.bind(this);
        this.load = this.load.bind(this)
        this.remove = this.remove.bind(this);
        this.updateComment = this.updateComment.bind(this)
    }
    protected commentIdCol: string;
    protected idCol: string;
    protected authorCol: string;
    protected commentCol: string;
    protected timeCol: string;
    protected mapper: StringMap;
    async load(commentId: string): Promise<CommentThread | null> {

        const objs: CommentThread[] = await this.query<CommentThread>(`select * from ${this.table} where ${this.commentIdCol} =  ${this.param(1)}`, [commentId], this.mapper);
        if (!objs || objs.length === 0) {
            return null;
        } else {
            const fn = this.fromDB;
            if (fn) {
                return fn(objs[0]);
            } else {
                return objs[0];
            }
        }
    }
    insert(obj: CommentThread): Promise<number> {
        const stmt = buildToInsert(obj, this.table, this.attributes, this.param, this.version);
        if (stmt) {
            return this.execBatch([stmt], true);
        } else {
            return Promise.resolve(0);
        }
    }
    updateComment(obj: CommentThread): Promise<number> {
        const stmt = buildToUpdate(obj, this.table, this.attributes, this.param)
        if (stmt) {
            return this.execBatch([stmt])
        }
        return Promise.resolve(-1)
    }
    remove(commentId: string): Promise<number> {
        const stmt = buildToDelete<string>(commentId, this.table, this.primaryKeys, this.param)
        if (stmt) {
            return this.execBatch([stmt])
        } else {
            return Promise.resolve(-1)
        }
    }
}

// export class InfoCommentThreadRepository extends Repository<CommentThreadInfo, string> implements SqlInfoCommentThreadRepository {
//     constructor(protected db: DB, public table: string, protected attrs: Attributes) {
//         super(db, table, attrs)
//         this.remove = this.remove.bind(this)
//     }
//     remove(commentId: string): Promise<number> {
//         const stmt = buildToDelete<string>(commentId, this.table, this.primaryKeys, this.param)
//         if (stmt) {
//             return this.execBatch([stmt])
//         } else {
//             return Promise.resolve(-1)
//         }
//     }
// }

export class CommentThreadReplyRepository extends Repository<CommentThreadReply, string> implements SqlCommentThreadReplyRepository {
    protected commentThreadIdCol:string;
    protected tableCommentThreadInfo: string;
    protected replyCountInfoCol: string;
    protected commentThreadIdInfoCol: string;
    protected usefulCountInfoCol: string;
    // protected parentCol: string;
    constructor(db: DB, table: string, protected attrs: Attributes,commentThreadIdCol:string,tableCommentThreadInfo: string, commentThreadIdInfoCol: string, replyCountInfoCol: string, usefulCountInfoCol: string) {
        super(db, table, attrs)
        this.tableCommentThreadInfo = tableCommentThreadInfo
        this.commentThreadIdInfoCol = commentThreadIdInfoCol
        this.replyCountInfoCol = replyCountInfoCol ?? "replyCount"
        this.usefulCountInfoCol = usefulCountInfoCol ?? "usefulCount"
        this.commentThreadIdCol = commentThreadIdCol ?? "commentThreadId"
        // this.parentCol = parentCol

        this.replyComment = this.replyComment.bind(this)
        this.removeComment = this.removeComment.bind(this)
        this.getComments = this.getComments.bind(this)
    }
    getComments(commentThreadId: string): Promise<CommentThreadReply[]> {
        return this.query<CommentThreadReply>(`select * from ${this.table} where ${this.commentThreadIdCol} = ${this.param(1)}`, [commentThreadId], this.map);

    }
    replyComment(obj: CommentThreadReply): Promise<number> {
        obj.time = new Date()
        const stmt = buildToInsert(obj, this.table, this.attrs, this.param)
        if (stmt) {
            const sql = `insert into ${this.tableCommentThreadInfo}(${this.commentThreadIdInfoCol},${this.replyCountInfoCol},${this.usefulCountInfoCol}) values(${this.param(1)},1,0) on conflict(${this.commentThreadIdInfoCol}) do update set ${this.replyCountInfoCol} = ${this.tableCommentThreadInfo}.${this.replyCountInfoCol} + 1 where ${this.tableCommentThreadInfo}.${this.commentThreadIdInfoCol} = ${this.param(1)}`
            const stmt2: Statement = {
                query: sql,
                params: [obj.commentThreadId]
            }
            return this.execBatch([stmt, stmt2], true)
        }
        return Promise.resolve(-1)
    }
    removeComment(articlecommentid: string): Promise<number> {
        const stmt = buildToDelete(articlecommentid, this.table, this.primaryKeys, this.param)
        if (stmt) {
            const query = `update ${this.tableCommentThreadInfo} set ${this.replyCountInfoCol} = ${this.replyCountInfoCol} - 1 where ${this.commentThreadIdInfoCol} = ${this.param(1)}`
            const stmt2: Statement = {
                query: query,
                params: [articlecommentid]
            }
            return this.execBatch([stmt, stmt2])
        }
        return Promise.resolve(-1)
    }

}
