import { fileUploadGalleryModel } from '../my-profile';
import { UploadInfo } from 'one-storage';
import { Attributes, DateRange, Filter, NumberRange, Query, Repository, Service } from 'onecore';

export interface Item {
  id: string;
  title: string;
  status: string;
  price: number;
  brand: string;
  publishedAt: Date;
  expiredAt: Date;
  description?: string;
  categories?: string[];
  gallery?: UploadInfo[];
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
export interface ItemQuery extends Query<Item, string, ItemFilter> {
}

export const itemModel: Attributes = {
  id: {
    key: true,
    length: 40
  },
  title: {
    required: true,
    length: 300,
    q: true
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
    length: 300,
  },
  categories: {
    type: 'strings',
  },
  gallery: {
    type: 'array',
    typeof: fileUploadGalleryModel,
  },
};
