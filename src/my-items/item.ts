import { Attributes, DateRange, Filter, NumberRange, Repository, Service, Query } from 'onecore';

export interface Item {
  id: string;
  title: string;
  status: string;
  price: number;
  imageURL?: string;
  brand: string;
  publishedAt?: Date;
  expiredAt?: Date;
  description?: string;
  categories?: string[];
}

export interface ItemFilter extends Filter {
  id?: string;
  title?: string;
  price?: NumberRange;
  brand?: string;
  publishAt?: DateRange;
  expiredAt?: DateRange;
  status?: string;
  description?: string;
  categories?: string[];
}

export interface ItemRepository extends Repository<Item, string> {
}

export interface ItemService extends Service<Item, string, ItemFilter> {
}

export const itemModel: Attributes = {
  id: {
    key: true,
    length: 40,
    match: 'equal',
  },
  title: {
    required: true,
    length: 300,
    q: true
  },
  imageURL: {
    length: 1500,
  },
  price: {
    type: 'number'
  },
  brand: {
    length: 255,
  },
  publishedAt: {
    type: 'datetime'
  },
  expiredAt: {
    type: 'datetime'
  },
  status: {
    match: 'equal',
    length: 1
  },
  description: {
    length: 1000,
  },
  categories: {
    type: 'strings',
  },
};
