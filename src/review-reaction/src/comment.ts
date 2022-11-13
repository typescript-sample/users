import { Attributes, Filter, Repository, SearchResult } from './core';

export interface Model {
  author: string;
  authorURL?: string;
}
export interface BaseRepository<R> {
  load(id: string, author: string): Promise<R | null>;
}
/*
export interface IReactionService<R, F extends Filter> {
  search(s: F, limit?: number, offset?: number | string, fields?: string[], ctx?: any): Promise<SearchResult<R>>;
  load(id: string, author: string): Promise<R | null>;
  setUseful(id: string, author: string, userId: string, ctx?: any): Promise<number>;
  removeUseful(id: string, author: string, userId: string, ctx?: any): Promise<number>;
  comment(comment: Comment): Promise<number>;
  removeComment(id: string, author: string, ctx?: any): Promise<number>;
  updateComment(comment: Comment): Promise<number>;
  getComments(id: string, author: string, limit?: number): Promise<Comment[]>;
  getComment(id: string): Promise<Comment | null>;
}
*/
export interface ReactionRepository {
  remove(id: string, author: string, userId: string, ctx?: any): Promise<number>;
  save(id: string, author: string, userId: string, type: number): Promise<number>;
}

export interface CommentRepository extends Repository<Comment, string> {
  remove(commentId: string, id: string, author: string): Promise<number>;
  getComments(id: string, author: string, limit?: number): Promise<Comment[]>;
}

export interface Query<T, ID, S> {
  search: (s: S, limit?: number, skip?: number | string, fields?: string[]) => Promise<SearchResult<T>>;
  load(id: ID, ctx?: any): Promise<T | null>;
}
export interface CommentQuery extends Query<Comment, string, CommentFilter> {
  getComments(id: string, author: string, limit?: number): Promise<Comment[]>;
}

export interface CommentId {
  id: string;
  author: string;
  userId: string;
}

export interface Comment {
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
}
export interface ShortComment {
  comment: string;
  time: Date;
}

export interface CommentFilter extends Filter {
  commentId?: string;
  id?: string;
  author?: string;
  userId?: string;
  comment?: string;
  time?: Date;
  updatedAt?: Date;
}

export const rateInfoModel: Attributes = {
  id: {
    key: true
  },
  rate: {
    type: 'number',
  },
  count: {
    type: 'integer',
  },
  score: {
    type: 'number',
  }
};

export const ratesModel: Attributes = {
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
    required: true,
    type: 'integers'
  },
  time: {
    type: 'datetime'
  },
  review: {},
};
