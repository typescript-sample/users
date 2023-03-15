import { Attributes, Filter } from './core';

export interface RateId {
  id: string;
  author: string;
}
export interface BaseRate {
  author: string;
  authorURL?: string;
  name: string;
  displayName: string;
  anonymous: boolean;
  rate: number;
}
export interface Rate extends BaseRate {
  id: string;
  time: Date;
  review: string;
  usefulCount: number;
  replyCount: number;
  histories?: ShortRate[];
}
export interface ShortRate {
  rate: number;
  time: Date;
  review: string;
}
export interface RateFilter extends Filter {
  id?: string;
  author?: string;
  rate: number;
  time?: Date;
  review?: string;
  usefulCount?: number;
  replyCount?: number;
}
export interface RateInfo {
  id: string;
  rate: number;
  count: number;
  score: number;
}
export interface ShortRates {
  rates: number[];
  time: Date;
  review: string;
}
export interface Rates extends BaseRate {
  id: string;
  rates: number[];
  time: Date;
  review: string;
  usefulCount: number;
  replyCount: number;
  histories?: ShortRates[];
}
export interface RatesFilter extends RateFilter {
  rates?: number[];
  rate1: number;
  rate2: number;
  rate3: number;
  rate4: number;
  rate5: number;
  rate6: number;
  rate7: number;
  rate8: number;
  rate9: number;
  rate10: number;
}
export interface BaseRepository<R> {
  insert(rate: R, newInfo?: boolean): Promise<number>;
  update(rate: R, oldRate: number): Promise<number>;
  load(id: string, author: string): Promise<R | null>;
}

export interface Rater<R> {
  rate(rate: R): Promise<number>;
}
export const rateHistoryModel: Attributes = {
  rate: {
    type: 'integer'
  },
  time: {
    type: 'datetime',
  },
  review: {
  },
};
export const rateModel: Attributes = {
  id: {
    key: true,
    required: true,
    match: 'equal'
  },
  author: {
    key: true,
    required: true,
    match: 'equal'
  },
  rate: {
    type: 'integer',
    min: 1,
  },
  time: {
    type: 'datetime',
  },
  review: {
    q: true,
  },
  usefulCount: {
    type: 'integer',
    min: 0
  },
  replyCount: {
    type: 'integer',
    min: 0
  },
  histories: {
    type: 'array',
    typeof: rateHistoryModel
  },
  anonymous: {
    type: 'boolean',
  }
};

export const infoModel: Attributes = {
  id: {
    key: true,
  },
  rate: {
    type: 'number'
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
  },
  count: {
    type: 'number',
  },
  score: {
    type: 'number',
  }
};
export const info10Model: Attributes = {
  id: {
    key: true,
  },
  rate: {
    type: 'number'
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
  },
  rate6: {
    type: 'number',
  },
  rate7: {
    type: 'number',
  },
  rate8: {
    type: 'number',
  },
  rate9: {
    type: 'number',
  },
  rate10: {
    type: 'number',
  },
  count: {
    type: 'number',
  },
  score: {
    type: 'number',
  }
};
export interface Info {
  id: string;
  rate: number;
  rate1: number;
  rate2: number;
  rate3: number;
  rate4: number;
  rate5: number;
  count: number;
  score: number;
}
export interface Info10 {
  id: string;
  rate: number;
  rate1: number;
  rate2: number;
  rate3: number;
  rate4: number;
  rate5: number;
  rate6: number;
  rate7: number;
  rate8: number;
  rate9: number;
  rate10: number;
  count: number;
  score: number;
}
export interface InfoRepository {
  exist(id: string, ctx?: any): Promise<boolean>;
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
