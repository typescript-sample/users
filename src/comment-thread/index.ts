import { Request, Response } from "express";
import { buildArray, ErrorMessage, format, fromRequest, getParameters, handleError, jsonResult, Log, SearchResult } from "express-ext";
import { Search } from "onecore";
import { Statement } from "pg-extension";
import { Attributes, buildMap, buildToDelete, buildToInsert, buildToUpdate, DB, Repository, StringMap } from "query-core";
import { ReactionRepository } from "review-reaction";
import { CommentReactionService, CommentThread, CommentThreadFilter, CommentThreadReply, CommentThreadService, ShortComment, SqlCommentThreadReplyRepository, SqlCommentThreadRepository } from "./comment-thread";
export * from './comment-thread'

// ------------- COMMENT THREAD -------------- 
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
    protected parentReplyCol: string
    protected commentThreadIdCol: string
    protected commentReplyTable: string
    protected commentIdReplyCol: string
    constructor(protected log: Log, protected commentThreadService: CommentThreadService, public commentThreadValidator: CommentThreadValidator,
        commentIdCol: string, idCol: string, authorCol: string, userIdCol: string, commentCol: string, commentThreadIdCol: string, parentReplyCol: string, private generate: () => string,
        commentReplyTable: string, commentIdReplyCol: string) {
        this.idCol = idCol;
        this.commentIdCol = commentIdCol;
        this.authorCol = authorCol;
        this.commentCol = commentCol;
        this.userIdCol = userIdCol;
        this.commentThreadIdCol = commentThreadIdCol;
        this.parentReplyCol = parentReplyCol;
        this.commentReplyTable = commentReplyTable;
        this.commentIdReplyCol = commentIdReplyCol;
        this.comment = this.comment.bind(this);
        this.removeCommentThread = this.removeCommentThread.bind(this);
        this.removeCommentReply = this.removeCommentReply.bind(this);
        this.updateComment = this.updateComment.bind(this);
        this.updateCommentReply = this.updateCommentReply.bind(this);
        this.search = this.search.bind(this);
        this.reply = this.reply.bind(this);
        this.getReplyComments = this.getReplyComments.bind(this);
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
        comment[this.userIdCol] = author
        this.commentThreadService.comment(comment).then((rep) => {
            return res.status(200).json(rep).end()
        }).catch((error) => {
            handleError(error, res, this.log)
        })
    }
    removeCommentThread(req: Request, res: Response) {
        this.commentThreadService.removeThreadComment(req.params[this.commentIdCol]).then(rep => {
            return res.status(200).json(rep).end()
        }).catch((error) => {
            handleError(error, res, this.log)
        })
    }

    removeCommentReply(req: Request, res: Response) {
        this.commentThreadService.removeReplyComment(req.params[this.commentIdCol], req.params[this.commentThreadIdCol]).then(rep => {
            return res.status(200).json(rep).end()
        }).catch(err => {
            handleError(err, res, this.log)
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
        comment[this.userIdCol] = req.params[this.authorCol]
        comment[this.idCol] = req.params[this.idCol]
        comment[this.parentReplyCol] = req.body[this.parentReplyCol]
        comment[this.commentIdCol] = this.generate()
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

    updateCommentReply(req: Request, res: Response) {
        const comment = req.body
        comment[this.commentIdReplyCol] = req.params[this.commentIdReplyCol]
        this.commentThreadService.updateReplyComment(comment)
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
        this.replyComment = this.replyComment.bind(this)
        this.updateComment = this.updateComment.bind(this)
        this.removeThreadComment = this.removeThreadComment.bind(this)
        this.removeReplyComment = this.removeReplyComment.bind(this)
    }
    async updateReplyComment(comment: CommentThreadReply): Promise<number> {
        const exist = await this.commentThreadReplyRepository.load(comment.commentId);
        if (!exist)
            return -1;
        if (exist.commentId != comment.commentId) {
            return -1;
        }
        exist.updatedAt = new Date();
        const c: ShortComment = { comment: exist.comment, time: exist.time };
        if (exist.histories && exist.histories.length > 0) {
            exist.histories.push(c);
        } else {
            exist.histories = [c];
        }
        exist.comment = comment.comment;
        const res = this.commentThreadReplyRepository.updateComment(exist);
        return res;
    }
    removeReplyComment(commentId: string, commentThreadId: string): Promise<number> {
        return this.commentThreadReplyRepository.removeComment(commentId, commentThreadId)
    }
    getReplyComments(commentThreadId: string): Promise<CommentThreadReply[]> {
        return this.commentThreadReplyRepository.getComments(commentThreadId)
    }
    replyComment(obj: CommentThreadReply): Promise<number> {
        return this.commentThreadReplyRepository.replyComment(obj)
    }
    search(s: CommentThreadFilter, limit?: number, offset?: number | string, fields?: string[]): Promise<SearchResult<CommentThread>> {
        return this.find(s, limit, offset, fields).then(res => {
            if (!this.queryURL) {
                return res;
            } else {
                if (res.list && res.list.length > 0) {
                    const ids: string[] = [];
                    for (const comment of res.list) {
                        ids.push(comment.author);
                    }
                    return this.queryURL(ids).then(urls => {
                        for (const comment of res.list) {
                            const i = binarySearch(urls, comment.author);
                            if (i >= 0) {
                                comment.authorURL = urls[i].url;
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
    async removeThreadComment(commentId: string): Promise<number> {
        const obj = await this.commentThreadRepository.load(commentId);
        if (obj) {
            return this.commentThreadRepository.removeThreadComment(commentId);
        } else {
            return Promise.resolve(0);
        }
    }
    async updateComment(comment: CommentThread): Promise<number> {
        const exist = await this.commentThreadRepository.load(comment.commentId);
        if (!exist)
            return -1;
        if (exist.commentId != comment.commentId) {
            return -1;
        }
        exist.updatedAt = new Date();
        const c: ShortComment = { comment: exist.comment, time: exist.time };
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
        commentIdCol: string, idCol: string, authorCol: string, commentCol: string, timeCol: string,
        commentReplyTable: string, idCommentThreadReplyCol: string,
        infoTable: string, idInfoCol: string) {
        super(db, table, attributes)
        this.commentIdCol = commentIdCol;
        this.idCol = idCol;
        this.authorCol = authorCol;
        this.commentCol = commentCol;
        this.timeCol = timeCol;
        this.commentReplyTable = commentReplyTable
        this.idCommentThreadReplyCol = idCommentThreadReplyCol
        this.infoTable = infoTable
        this.idInfoCol = idInfoCol
        this.mapper = buildMap(this.attributes)
        this.insert = this.insert.bind(this);
        this.load = this.load.bind(this)
        this.removeThreadComment = this.removeThreadComment.bind(this);
        this.updateComment = this.updateComment.bind(this)
    }

    protected commentIdCol: string;
    protected idCol: string;
    protected authorCol: string;
    protected commentCol: string;
    protected timeCol: string;
    protected commentReplyTable: string;
    protected idCommentThreadReplyCol: string;
    protected infoTable: string;
    protected idInfoCol: string;
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
    removeThreadComment(commentId: string): Promise<number> {
        const stmt = buildToDelete<string>(commentId, this.table, this.primaryKeys, this.param)
        if (stmt) {
            const stmt2: Statement = {
                query: `delete from ${this.commentReplyTable} where ${this.idCommentThreadReplyCol} = ${this.param(1)}`,
                params: [commentId]
            }
            const stmt3: Statement = {
                query: `delete from ${this.infoTable} where ${this.idInfoCol} = ${this.param(1)}`,
                params: [commentId]
            }
            return this.execBatch([stmt, stmt2, stmt3])
        } else {
            return Promise.resolve(-1)
        }
    }

}

export class CommentThreadReplyRepository extends Repository<CommentThreadReply, string> implements SqlCommentThreadReplyRepository {
    protected commentIdCol: string
    protected commentThreadIdCol: string;
    protected authorCol: string;
    protected tableCommentThreadInfo: string;
    protected replyCountInfoCol: string;
    protected commentThreadIdInfoCol: string;
    protected usefulCountInfoCol: string;
    protected userTable: string;
    protected usernameCol: string;
    protected avatarCol: string;
    protected userIdCol: string;
    constructor(db: DB, table: string, protected attrs: Attributes, commentIdCol: string, authorCol: string, commentThreadIdCol: string, tableCommentThreadInfo: string, commentThreadIdInfoCol: string, replyCountInfoCol: string, usefulCountInfoCol: string,
        userTable: string, userIdCol: string, usernameCol: string, avatarCol: string) {
        super(db, table, attrs)
        this.tableCommentThreadInfo = tableCommentThreadInfo
        this.commentIdCol = commentIdCol
        this.commentThreadIdInfoCol = commentThreadIdInfoCol
        this.replyCountInfoCol = replyCountInfoCol
        this.usefulCountInfoCol = usefulCountInfoCol
        this.commentThreadIdCol = commentThreadIdCol
        this.authorCol = authorCol
        this.userTable = userTable
        this.userIdCol = userIdCol
        this.avatarCol = avatarCol
        this.usernameCol = usernameCol

        this.replyComment = this.replyComment.bind(this)
        this.removeComment = this.removeComment.bind(this)
        this.getComments = this.getComments.bind(this)
        this.updateComment = this.updateComment.bind(this)
        this.load = this.load.bind(this)
    }
    async load(commentId: string): Promise<CommentThreadReply | null> {
        const objs: CommentThreadReply[] = await this.query<CommentThreadReply>(`select * from ${this.table} where ${this.commentIdCol} = ${this.param(1)}`, [commentId], this.map)
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
    updateComment(obj: CommentThreadReply): Promise<number> {
        const stmt = buildToUpdate(obj, this.table, this.attrs, this.param)
        if (stmt) {
            return this.execBatch([stmt])
        } else {
            return Promise.resolve(-1)
        }
    }
    getComments(commentThreadId: string): Promise<CommentThreadReply[]> {
        return this.query<CommentThreadReply>(`select a.*, b.${this.usernameCol}, b.${this.avatarCol} from ${this.table} a join ${this.userTable} b on a.${this.authorCol} = b.${this.userIdCol} where a.${this.commentThreadIdCol} = ${this.param(1)}`, [commentThreadId], this.map);

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
    removeComment(commentId: string, commentThreadId: string): Promise<number> {
        const stmt = buildToDelete(commentId, this.table, this.primaryKeys, this.param)
        if (stmt) {
            const query = `update ${this.tableCommentThreadInfo} set ${this.replyCountInfoCol} = ${this.replyCountInfoCol} - 1 where ${this.commentThreadIdInfoCol} = ${this.param(1)}`
            const stmt2: Statement = {
                query: query,
                params: [commentThreadId]
            }
            return this.execBatch([stmt, stmt2])
        }
        return Promise.resolve(-1)
    }


}


// ------------ COMMENT REACTION ---------------------
// export class CommentReactionRepository<T> implements SqlCommentReactionRepository<T>{
//     constructor(protected db: DB, protected reactionTable: string, protected attrs: Attributes,
//         protected commentIdCol: string,
//         protected idCol: string,
//         protected authorCol: string,
//         protected infoTable: string,
//         protected commentIdInfoCol:string,
//         protected replyCountCol:string,
//         protected usefulCountCol: string,
        
//     ) {
//         this.load = this.load.bind(this)
//         this.setUseful = this.setUseful.bind(this)
//         this.removeUseful = this.removeUseful.bind(this)
//     }

//     async load(commentId: string, id: string, author: string): Promise<T | null> {
//         const objs: T[] = await this.db.query<T>(`select *from where ${this.commentIdCol} = ${this.db.param(1)}`);
//         if (!objs || objs.length === 0) {
//             return null;
//         } else {
//             return objs[0];
//         }
//     }

//     setUseful(obj: T): Promise<number> {
//         const stmt = buildToInsert(obj, this.reactionTable, this.attrs, this.db.param)
//         const date
//         if (stmt) {
//             const stmt2: Statement = {
//                 query: `insert into ${this.infoTable}(${this.commentIdInfoCol},${this}) values(${this.db.param(1),}) on conflict do update set ${this.usefulCountCol} = ${this.db.param(1)}`,
//                 params: []
//             }
//             return this.db.execBatch([stmt, stmt2])
//         }
//         return Promise.resolve(-1)
//     }
//     removeUseful(commentId: string, id: string, author: string): Promise<number> {
//         // const stmt: Statement = {
//         //     // query: `delete from ${this.retable} where `
//         // }
//         return Promise.resolve(-1);
//     }

// }


export class CommentReactionClient implements CommentReactionService {
    constructor(protected commentReactionRepository: ReactionRepository) {
        this.setUseful = this.setUseful.bind(this)
        this.removeUseful = this.removeUseful.bind(this)
    }
    async setUseful(commentId: string, author: string, userId: string): Promise<number> {
        return this.commentReactionRepository.save(commentId,author,userId,1)
    }
    async removeUseful(commentId: string, author: string, userId: string): Promise<number> {
        return this.commentReactionRepository.remove(commentId, author, userId)
    }
}

export class CommentReactionController {
    constructor(protected log: Log, protected commentReactionService: CommentReactionService,
        protected commentIdCol: string, protected authorCol: string, protected userCol:string) {
        this.setUserful = this.setUserful.bind(this)
        this.removeUseful = this.removeUseful.bind(this)
    }
    setUserful(req: Request, res: Response) {
        this.commentReactionService.setUseful(req.params[this.commentIdCol], req.params[this.authorCol], req.params[this.userCol])
            .then(result => res.status(200).json(result).end()).catch(err => handleError(err, res, this.log))
    }
    removeUseful(req: Request, res: Response) {
        this.commentReactionService.removeUseful(req.params[this.commentIdCol], req.params[this.authorCol], req.params[this.userCol])
            .then(result => res.status(200).json(result).end()).catch(err => handleError(err, res, this.log))

    }

} 