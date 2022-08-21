import { uploadModel } from 'one-storage';
import { Attributes, Filter, Info, Query, Repository } from 'onecore';

export interface CinemaFilter extends Filter {
  id?: string;
  name?: string;
  address?: string;
  parent?: string;
  status?: string;
  latitude?: number;
  longtitude?: number;
  imageURL?: string;
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
  imageUrl: string;
  createdBy: Date;
  createAt: Date;
  createdAt: Date;
  updatedBy: Date;
  updatedAt: Date;
  gallery?: string;
  coverUrl: string;
  info?: Info;
}

export interface CinemaRepository extends Repository<Cinema, string> {}

export interface CinemaQuery extends Query<Cinema, string, CinemaFilter> {}



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
    typeof: uploadModel,
  },
  coverURL: {},
};
