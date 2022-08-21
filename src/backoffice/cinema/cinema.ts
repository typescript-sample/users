import { Attributes, Filter, Service } from 'onecore';
import { Repository } from 'query-core';
import { Info } from 'rate-core';
import { fileUploadGalleryModel } from '../../my-profile';

export interface CinemaFilter extends Filter {
  id?: string;
  name?: string;
  address?: string;
  parent?: string;
  status?: string;
  latitude?: number;
  longtitude?: number;
  imageURL: string;
  createdBy?: Date;
  createAt?: Date;
  createdAt?: Date;
  updatedBy?: Date;
  updatedAt?: Date;
  gallery?: string;
  coverURL?: string;
  info?: Info;
}

export interface Cinema {
  id: string;
  name: string;
  address: string;
  parent: string;
  status: string;
  latitude: number;
  longtitude: number;
  imageURL: string;
  createdBy: Date;
  createAt: Date;
  createdAt: Date;
  updatedBy: Date;
  updatedAt: Date;
  gallery?: string;
  coverURL: string;
  info?: Info;
}

export interface CinemaRepository extends Repository<Cinema, string> {}

export interface CinemaService extends Service<Cinema, string, CinemaFilter> {}

export const galleryModel: Attributes = {
  url: {
    required: true,
  },
  type: {
    required: true,
  },
};

export const cinemaModel: Attributes = {
  id: {
    key: true,
    length: 40,
    match: 'equal',
  },
  name: {
    length: 255,
  },
  address: {
    length: 255,
  },
  parent: {
    length: 40,
  },
  status: {
    length: 1,
  },
  latitude: {
    length: 255,
  },
  longitude: {
    length: 255,
  },
  imageURL: {},
  createdBy: {},
  createdAt: {
    column: 'createdat',
    type: 'datetime',
  },
  updatedBy: {},
  updatedAt: {
    column: 'createdat',
    type: 'datetime',
  },
  gallery: {
    type: 'array',
    typeof: fileUploadGalleryModel,
  },
  coverURL: {},
};
