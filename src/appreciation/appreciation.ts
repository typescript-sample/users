import { Attributes, Filter } from 'onecore';

export interface AppreciationFilter extends Filter {
  id?: string;
  author?: string;
  title?: string;
  review?: string;
  createAt?: Date;
  replyCount?: number;
}

export interface Appreciation {
  id: string;
  author: string;
  title: string;
  review: string;
  time: Date;
  updateAt: Date;
  histories?: Histories[];
  replyCount?: number;
}

export interface Histories {
  time: Date;
  review: string;
  // title: string;
}
export interface AppreciationRepository {
  load(id: string, author: string): Promise<Appreciation | null>;
  insert(obj: Appreciation, newInfo?: boolean): Promise<number>;
  update(obj: Appreciation): Promise<number>;
  delete(id: string, author: string, ctx?: any): Promise<number>;
}
export interface AppreciationService {
  response(response: Appreciation): Promise<number>;
}

export const appreciationModel: Attributes = {
  id: {
    key: true,
    match: 'equal',
    required: true,
  },
  author: {
    key: true,
    required: true,
    match: 'equal',
  },
  // title: {
  //   length: 255
  // },
  review: {
    length: 255
  },
  time: {
    type: 'datetime'
  },
  updateAt: {
    type: 'datetime'
  },
  usefulCount: {
    type: 'integer',
    min: 0,
  },
  replyCount: {
    type: 'integer',
    min: 0
  },
  histories: {
  }
};

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
  comment: string;
  time: Date;
  updateAt: Date;
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
  time: {
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
