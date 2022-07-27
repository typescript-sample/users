import { Attributes, DateRange, Filter, Repository, Service } from 'onecore';
import { SearchResult } from 'query-core';

export interface AppreciationFilter extends Filter {
  id?: string;
  author?: string;
  title?: string;
  review?: string;
  createAt?: Date;
  replyCount?: number;
}

export interface AppreciationId {
  id: string;
  author: string;
}
export interface Appreciation {
  id: string;
  author: string;
  title: string;
  review: string;
  time: Date;
  updateAt: Date;
  histories?: Histories[];
  replyCount?:number
}

export interface Histories {
  time: Date;
  review: string;
}
export interface AppreciationRepository extends Repository<Appreciation, AppreciationId> {
  getAppreciation(id: string, author: string): Promise<Appreciation | null>;
  increaseReplyCount(id: string, author: string, ctx?: any): Promise<number>;
  decreaseReplyCount(id: string, author: string, ctx?: any): Promise<number>;
}
export interface AppreciationService extends Service<Appreciation, AppreciationId, AppreciationFilter> {
  reply(reply: Reply): Promise<boolean>;
  removeReply(id: string, author: string, userId: string, ctx?: any): Promise<number>;
  updateReply(reply: Reply): Promise<number>;
  setUseful(id: string, author: string, userId: string, ctx?: any): Promise<number>;
  getReplys(id: string, author: string, ctx?: any): Promise<Reply[]>;
  // usefulAppreciation(obj: UsefulFilter): Promise<number>;
  // searchWithReply(s: AppreciationFilter, userId?: string, limit?: number, offset?: string | number, fields?: string[]): Promise<SearchResult<Appreciation>>;
}

export const appreciationModel: Attributes = {
  id: {
    key: true,
    length: 40
  },
  author: {
    required: true,
    length: 255,
  },
  title: {
    length: 255
  },
  review: {
    length: 255
  },
  time: {
    type: 'datetime'
  },
  updateAt:{
    type: 'datetime'
  },
  histories:{

  },
  replyCount:{
    type: 'integer',
    min: 0
  }
};

//////////

export interface ReplyFilter extends Filter {
  id?: string;
  author?: string;
  userId?: string;
  title?: string;
  review?: string;
  createdAt?: Date;
  updatedAt?: Date;
  appreciationId?: string;
}
export interface Reply {
  id: string;
  author: string;
  userId: string;
  review: string;
  createAt: Date;
  updateAt: Date;
}
export interface ReplyRepository extends Repository<Reply, ReplyId> {
  getReply(id: string, author: string, userId: string): Promise<Reply | null>;
  getReplys(id: string, author: string): Promise<Reply[]>;
  save(obj: Reply, ctx?: any): Promise<number>;
  removeReply(id: string, author: string, userId: string, ctx?: any): Promise<number>;
  increaseUsefulCount(id: string, author: string, userId: string, ctx?: any): Promise<number>;
  decreaseUsefulCount(id: string, author: string, userId: string, ctx?: any): Promise<number>;
}
export interface ReplyService extends Service<Reply, ReplyId, ReplyFilter> {
}

export interface ReplyId {
  id: string;
  author: string;
  userId: string;
}

export const replyModel: Attributes = {
  id: {
    key: true,
    required: true,
    match: 'equal'
  },
  userId: {
    key: true,
    required: true,
    match: 'equal'
  },
  author: {
    key: true,
    required: true,
    match: 'equal'
  },
  title: {
    length: 255
  },
  review: {
    length: 255
  },
  createAt: {
    type: 'datetime'
  },
  updateAt: {
    type: 'datetime'
  },
};

export interface UsefulId {
  id: string;
  author: string;
  userId: string;
}
export interface UsefulFilter extends Filter {
  id?: string;
  userId?: string;
  author?: string;
  reviewTime?: Date;
}
export interface Useful {
  id: string;
  author: string;
  userId: string;
  reviewTime: Date;
}
export interface UsefulRepository {
  getUseful(id: string, author: string, userId: string): Promise<Useful | null>;
  removeUseful(id: string, author: string, userId: string, ctx?: any): Promise<number>;
  save(obj: Useful, ctx?: any): Promise<number>;
}

export const usefulModel: Attributes = {
  userId: {
    required: true,
    length: 255,
  },
  appreciationId: {
    required: true,
    length: 255,
  },
  createdAt: {
    type: 'datetime'
  },
  updatedAt: {
    type: 'datetime'
  },
};
