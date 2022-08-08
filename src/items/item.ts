import { UploadInfo } from 'one-storage';
import { Attributes, DateRange, Filter, NumberRange, Query, Repository } from 'onecore';
import { fileUploadGalleryModel } from '../my-profile';

export interface Item {
  id: string;
  title: string;
  status: string;
  price: number;
  imageurl?: string;
  brand: string;
  publishedAt?: Date;
  expiredAt?: Date;
  description?: string;
  categories?: string[];
  gallery?: UploadInfo[];
}

export interface ItemFilter extends Filter {
  id?: string;
  title?: string;
  price?: NumberRange;
  brand?: string;
  publishedAt?: DateRange;
  expiredAt?: DateRange;
  status?: string;
  description?: string;
  categories?: string[];
  sortItem: string;
}

export interface ItemRepository extends Repository<Item, string> {
  getItems(ids: string[]): Promise<Item[]>;
}
export interface ItemQuery extends Query<Item, string, ItemFilter> {
  saveItems(id: string, itemId: string): Promise<number>;
  getSavedItems(id: string): Promise<Item[]>;
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
  imageURL: {
    length: 1500,
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
export interface SavedItemsRepository {
  load(id: string, ctx?: any): Promise<string[]|null>;
  insert(id: string, arr: string[]): Promise<number>;
  update(id: string, arr: string[]): Promise<number>;
}
