import { UploadInfo } from 'one-storage';
import { Attributes, Filter, Info, NumberRange, Query, Repository, SearchResult } from 'onecore';
import { fileUploadGalleryModel } from '../my-profile';

export interface Company {
  id: string;
  name: string;
  description: string;
  address: string;
  size: number;
  status: string;
  establishedAt: Date;
  categories: string[];
  info?: Info;
  imageURL?: string;
  coverURL?: string;
  gallery?: UploadInfo[];
}

export interface CompanyFilter extends Filter {
  id?: string;
  name?: string;
  description?: string;
  address?: string;
  size?: NumberRange;
  status?: string;
  establishedAt?: Date;
  categories?: string[];
  info?: Info;
}
export interface CompanyRepository extends Repository<Company, string> {

}
export interface CompanyQuery extends Query<Company, string, CompanyFilter> {

}
export const companyModel: Attributes = {
  id: {
    key: true,
    match: 'equal',
  },
  name: {
    length: 120,
  },
  description: {
    length: 1000,
  },
  size: {
    type: 'number',
  },
  address: {
    length: 255,
  },
  status: {
    match: 'equal',
    length: 1,
  },
  establishedAt: {
    type: 'datetime',
  },
  categories: {
    type: 'strings',
  },
  imageURL: {},
  coverURL: {},
  gallery: {
    type: 'array',
    typeof: fileUploadGalleryModel,
  },
};


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
  rate1: number;
  rate2: number;
  rate3: number;
  rate4: number;
  rate5: number;
}

export const rateFullInfoModel: Attributes = {
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
  },
  rate1: {
    type: 'number',
  },
  rate2: {
    type: 'number',
  },
  rate3: {
    type: 'number',
  },
  rate4: {
    type: 'number',
  },
  rate5: {
    type: 'number',
  }
};

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
    type: 'integers'
  },
  time: {
    type: 'datetime'
  },
  review: {},
  gallery: {
    type: 'array',
    typeof: fileUploadGalleryModel,
  },
  coverURL: {},
  iamgeURL: {},
};



