import { fileUploadGalleryModel } from '../my-profile';
import { UploadData, UploadGallery, UploadInfo } from 'one-storage';
import { Attributes, DateRange, Filter, NumberRange, Repository, Service } from 'onecore';

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
  imageUrl?: string;
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
  uploadCoverImage(id: string, data: UploadData[], sizes?: number[]): Promise<string>;
  uploadImage(id: string, data: UploadData[], sizes?: number[]): Promise<string>;
  uploadGalleryFile(uploadGallery: UploadGallery<string>): Promise<UploadInfo[]>;
  updateGallery(id: string, data: UploadInfo[]): Promise<boolean>;
  deleteGalleryFile(id: string, url: string): Promise<boolean>;
  getGalllery(id: string): Promise<UploadInfo[]>;
  addExternalResource(id: string, data: UploadInfo): Promise<boolean>;
  deleteExternalResource(id: string, url: string): Promise<boolean>;
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
  imageURL:{

  }
};
