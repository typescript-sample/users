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
    comment(comment: CommentThread): Promise<string>
    updateComment(comment: CommentThread): Promise<number>
    updateReplyComment(comment: Comment): Promise<number>
    replyComment(obj: Comment): Promise<string | number>
    getReplyComments(commentThreadId: string, userId?: string): Promise<Comment[]>
    removeReplyComment(commentId: string, commentThreadId: string): Promise<number>
    removeThreadComment(commentThreadId: string): Promise<number>
}

export interface CommentThreadRepository<R> {
    updateComment(comment: R): Promise<number>
    load(commentid: string): Promise<R | null>
    comment(obj: R): Promise<string>
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


export const commentThreadHistoryModel: Attributes = {
    comment: {

    },
    time: {
        type: 'datetime'
    },
}

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
        column: "usefulcount"
    },
    authorName: {
        column: 'username'
    }
}

// ------------------------

export interface Comment {
    commentId: string
    id: string
    author: string
    commentThreadId: string
    userId: string
    comment: string
    parent: string
    time: Date
    updatedAt: Date
    histories?: ShortComment[]
    authorURL?: string
    userURL?: string
    authorName?: string
    usefulCount?: number
    replyCount?: number
}

export interface CommentFilter {
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

export interface CommentThreadReplyRepository {
    load(commentId: string): Promise<Comment | null>
    getComments(commentThreadId: string, userId?: string): Promise<Comment[]>
    replyComment(obj: Comment): Promise<string>
    updateComment(obj: Comment): Promise<number>
    removeComment(commentId: string, commentThreadId: string): Promise<number>
}

export const commentThreadReplyHistoryModel: Attributes = {
    comment: {

    },
    time: {
        type: 'datetime'
    },
}
export const commentModel: Attributes = {
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
    },
    replyCount: {
        column: "replycount"
    },
    usefulCount: {
        column: "usefulcount"
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

export interface CommentReactionRepository {
    save(commentId: string, author: string, userId: string, reaction: number): Promise<number>
    remove(commentId: string, author: string, userId: string): Promise<number>
}

