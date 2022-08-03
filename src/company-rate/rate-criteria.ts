import { Attributes, Filter, SearchResult } from 'onecore';
import { Comment } from 'rate-core';

export interface RateCriteria {
    id: string;
    author: string;
    rate: number;
    rates: number[];
    time: Date;
    review: string;
    usefulCount: number;
    replyCount: number;
    histories?: ShortRate[];
    authorURL?: string;
}

export interface ShortRate {
    rates: number[];
    time: Date;
    review: string;
}

export interface RateCriteriaId {
    id: string;
    author: string;
}

export interface RateCriteriaFilter extends Filter {
    id?: string;
    author?: string;
    rates?: number[];
    time?: Date;
    review?: string;
    usefulCount?: number;
    replyCount?: number;
}

export interface RateCriteriaRepository<R> {
    load(id: string, author: string): Promise<R | null>;
    insert(rate: R, newInfo?: boolean): Promise<number>;
    update(rate: R, oldRate: number): Promise<number>;
}

export interface RateCriteriaService {
    search(s: RateCriteriaFilter, limit?: number, offset?: number | string, fields?: string[], ctx?: any): Promise<SearchResult<RateCriteria>>;
    load(id: string, author: string): Promise<RateCriteria | null>;
    rate(rate: RateCriteria): Promise<number>;

    setUseful(id: string, author: string, userId: string, ctx?: any): Promise<number>;
    removeUseful(id: string, author: string, userId: string, ctx?: any): Promise<number>;
    comment(comment: Comment): Promise<number>;
    removeComment(id: string, author: string, ctx?: any): Promise<number>;
    updateComment(comment: Comment): Promise<number>;
    getComments(id: string, author: string, limit?: number): Promise<Comment[]>;
    getComment(id: string): Promise<Comment | null>;
}

export interface RateFullInfo {
    id: string;
    rate: number;
    count: number;
    score: number;
}

export const rateFullInfoModel: Attributes = {
    id: {
        key: true
    },
    rate: {
        type: 'number',
    },
    count: {
        type: 'number',
    },
    score: {
        type: 'number',
    }
}

export const criteriaModel: Attributes = {
    criteria1: {
        type: 'number'
    },
    criteria2: {
        type: 'number'
    },
    criteria3: {
        type: 'number'
    },
    criteria4: {
        type: 'number'
    },
    criteria5: {
        type: 'number'
    }
}

export const rateCriteriaModel: Attributes = {
    id: {
        key: true,
        match: 'equal'
    },
    author: {
        key: true,
        match: 'equal'
    },
    rate: {
        type: 'number'
    },
    rates: {
        type: 'array',
        typeof: criteriaModel
    },
    time: {
        type: 'datetime'
    },
    review: {},
}