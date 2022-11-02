import { Request, Response } from "express";
import { Attributes, SearchResult } from "onecore"

export interface Validator<T> {
    validate(model: T, ctx?: any): Promise<ErrorMessage[]>;
}

export interface CommentThreadController {
    search(req: Request, res: Response): void
    comment(req: Request, res: Response): void
    remove(req: Request, res: Response): void
    updateComment(req: Request, res: Response): void
    getReplyComments(req: Request, res: Response): void
}

export interface CommentThreadService {
    search(s: CommentThreadFilter, limit?: number, offset?: number | string, fields?: string[]): Promise<SearchResult<CommentThread>>
    comment(comment: CommentThread): Promise<number>
    remove(commentid: string): Promise<number>
    updateComment(comment: CommentThread): Promise<number>
    replyComment(obj: CommentThreadReply): Promise<number>
    getReplyComments(commentThreadId: string): Promise<CommentThreadReply[]>
}

export interface SqlCommentThreadRepository<R> {
    // search(): void
    updateComment(comment: R): Promise<number>
    load(commentid: string): Promise<R | null>
    insert(obj: R): Promise<number>
    remove(commentid: string): Promise<number>
}
export interface ErrorMessage {
    field: string;
    code: string;
    param?: string | number | Date;
    message?: string;
}

export interface CommentThread {
    commentid: string;
    id: string;
    author: string;
    userId: string;
    comment: string;
    time: Date;
    updatedAt?: Date;
    histories?: ShortComment[];
    userURL?: string;
    authorURL?: string;
    replyCount?: number,
    usefulCount?: number
    // info?: CommentThreadInfo
}
export interface CommentThreadFilter {
    commentid?: string;
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
    commentid: {
        key: true,
        required: true,
        match: 'equal'
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
    replyCount:{
        column:"replycount"
    },
    usefulCount:{
        column:"useful"
    }
    // info: {
    //     typeof: commentThreadInfoModel
    // }
}


export interface SqlInfoCommentThreadRepository {
    remove(commentid: string): Promise<number>
}



// ------------------------

export interface CommentThreadReply {
    commentid: string
    id: string
    author: string
    commentThreadId: string
    comment: string
    parent: string
    time: Date
    updatedAt: Date
    Histories: ShortComment[]
    authorURL?: string
    userURL?: string
}

export interface CommentThreadReplyFilter {
    commentid?: string
    id?: string
    author?: string
    commentThreadId?: string
    comment?: string
    parent?: string
    time?: Date
    updatedAt?: Date
    Histories?: ShortComment[]
    authorURL?: string
    userURL?: string
}
export interface ShortComment {
    comment: string;
    time: Date;
}

export interface SqlCommentThreadReplyRepository {
    getComments(commentThreadId: string): Promise<CommentThreadReply[]>
    replyComment(obj: CommentThreadReply): Promise<number>
    removeComment(articlecommentid: string): Promise<number>

}

export const commentThreadReplyHistoryModel: Attributes = {
    comment: {

    },
    time: {
        type: 'datetime'
    },
}
export const commentThreadReplyModel: Attributes = {
    commentid: {
        key: true,
        column: "commentid"
    },
    id: {},
    commentThreadId: {
        column: "commentthreadid"
    },
    author: {},
    comment: {},
    time: {},
    parent: {},
    histories: {
        type: "array",
        typeof: commentThreadHistoryModel
    }

}