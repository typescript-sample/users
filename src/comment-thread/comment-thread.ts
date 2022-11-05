import { Request, Response } from "express";
import { Attributes, SearchResult } from "onecore"

export interface Validator<T> {
    validate(model: T, ctx?: any): Promise<ErrorMessage[]>;
}

export interface CommentThreadController {
    search(req: Request, res: Response): void
    comment(req: Request, res: Response): void
    removeCommentThread(req: Request, res: Response): void
    removeCommentReply(req: Request, res: Response): void
    updateComment(req: Request, res: Response): void
    updateCommentReply(req: Request, res: Response): void
    reply(req: Request, res: Response): void
    getReplyComments(req: Request, res: Response): void
}

export interface CommentThreadService {
    search(s: CommentThreadFilter, limit?: number, offset?: number | string, fields?: string[]): Promise<SearchResult<CommentThread>>
    comment(comment: CommentThread): Promise<number>
    updateComment(comment: CommentThread): Promise<number>
    updateReplyComment(comment: CommentThreadReply): Promise<number>
    replyComment(obj: CommentThreadReply): Promise<number>
    getReplyComments(commentThreadId: string): Promise<CommentThreadReply[]>
    removeReplyComment(commentId: string, commentThreadId: string): Promise<number>
    removeThreadComment(commentThreadId: string): Promise<number>
}

export interface SqlCommentThreadRepository<R> {
    updateComment(comment: R): Promise<number>
    load(commentid: string): Promise<R | null>
    insert(obj: R): Promise<number>
    removeThreadComment(commentId: string): Promise<number>
}
export interface ErrorMessage {
    field: string;
    code: string;
    param?: string | number | Date;
    message?: string;
}

export interface CommentThread {
    commentId: string;
    id: string;
    author: string;
    userId: string;
    comment: string;
    time: Date;
    updatedAt?: Date;
    histories?: ShortComment[];
    userURL?: string;
    authorURL?: string;
    replyCount?: number
    usefulCount?: number
    authorName?: string
    // info?: CommentThreadInfo
}
export interface CommentThreadFilter {
    commentId?: string;
    id?: string;
    author?: string;
    userId?: string;
    comment?: string;
    time?: Date;
    updatedAt?: Date;
    histories?: ShortComment[];
    userURL?: string;
    authorURL?: string;

}

// export interface CommentThreadInfo {
//     commentid: string,
//     replyCount: number,
//     usefulCount: number
// }


export const commentThreadHistoryModel: Attributes = {
    comment: {

    },
    time: {
        type: 'datetime'
    },
}
// export const commentThreadInfoModel: Attributes = {
//     commentid: {
//         key: true,
//         required: true
//     },
//     replyCount: {
//         default: 0
//     },
//     usefulCount: {
//         default: 0
//     }

// }
export const commentThreadModel: Attributes = {
    commentId: {
        key: true,
        match: 'equal',
        column: 'commentid'
    },
    id: {
        required: true,
        match: 'equal'
    },
    author: {
        required: true,
        match: 'equal'
    },
    userId: {
        match: 'equal'
    },
    comment: {

    },
    time: {
        type: 'datetime'
    },
    updatedAt: {
        type: 'datetime',
        column: 'updatedat'
    },
    histories: {
        type: 'array',
        typeof: commentThreadHistoryModel
    },
    replyCount: {
        column: "replycount"
    },
    usefulCount: {
        column: "useful"
    },
    authorName: {
        column: 'username'
    }
    // info: {
    //     typeof: commentThreadInfoModel
    // }
}


// export interface SqlInfoCommentThreadRepository {
//     remove(commentid: string): Promise<number>
// }



// ------------------------

export interface CommentThreadReply {
    commentId: string
    id: string
    author: string
    commentThreadId: string
    userId: string
    comment: string
    parent: string
    time: Date
    updatedAt: Date
    histories: ShortComment[]
    authorURL?: string
    userURL?: string
    authorName?: string
}

export interface CommentThreadReplyFilter {
    commentId?: string
    id?: string
    userId?: string
    author?: string
    commentThreadId?: string
    comment?: string
    parent?: string
    time?: Date
    updatedAt?: Date
    histories?: ShortComment[]
    authorURL?: string
    userURL?: string
    authorName?: string

}
export interface ShortComment {
    comment: string;
    time: Date;
}

export interface SqlCommentThreadReplyRepository {
    load(commentId: string): Promise<CommentThreadReply | null>
    getComments(commentThreadId: string): Promise<CommentThreadReply[]>
    replyComment(obj: CommentThreadReply): Promise<number>
    updateComment(obj: CommentThreadReply): Promise<number>
    removeComment(commentId: string, commentThreadId: string): Promise<number>
}

export const commentThreadReplyHistoryModel: Attributes = {
    comment: {

    },
    time: {
        type: 'datetime'
    },
}
export const commentThreadReplyModel: Attributes = {
    commentId: {
        key: true,
        column: "commentid"
    },
    id: {},
    commentThreadId: {
        column: "commentthreadid"
    },
    author: {},
    userId: {
        column: "userid"
    },
    comment: {},
    time: {},
    parent: {},
    histories: {
        type: "array",
        typeof: commentThreadHistoryModel
    },
    authorName: {
        column: "username"
    },
    userURL: {
        column: "imageurl"
    }
}

// -----------REACTION COMMENT-------------

export interface CommentReaction {
    commentId: string
    author: string
    userId: string
    time: Date
    reaction: number
}
// export interface CommentReactionFilter {
//     commentId?: string
//     author?: string
//     userId?: string
//     time?: Date
//     reaction?: number
// }

export const commentReactionModel: Attributes = {
    commentId: {
        key: true,
        match: 'equal'
    },
    author: {
        key: true,
        match: 'equal'
    },
    userId: {
        key: true,
        match: 'equal'
    },
    time: {
        type: 'datetime'
    },
    reaction: {
        type: 'integer'
    }
}
export interface CommentReactionController {
    setUserful(req: Request, res: Response): void
    removeUseful(req: Request, res: Response): void
}

export interface CommentReactionService {
    setUseful(commentId: string, author: string, userId: string): Promise<number>;
    removeUseful(commentId: string, author: string, userId: string): Promise<number>;
}

// export interface SqlCommentReactionRepository<T> {
//     load(commentId: string, id: string, author: string): Promise<T | null>;
//     setUseful(obj:T): Promise<number>;
//     removeUseful(commentId: string, id: string, author: string): Promise<number>;
// }

