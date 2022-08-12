import { Attributes, Filter, Info10, Query, ViewRepository } from 'onecore';

export interface FilmFilter extends Filter {
  id?: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  trailerUrl?: string;
  status?: string;
  categories?: string[];
  directors?: string[];
  casts?: string[];
  productions?: string[];
  countries?: string[];
  language?:string;
  writer?:string[];
}

export interface Film {
  id: string;
  title: string;
  status: string;
  description?: string;
  imageUrl?: string;
  trailerUrl?: string;
  categories?: string[];
  directors?: string[];
  casts?: string[];
  productions?: string[];
  countries?: string[];
  info?: Info10;
  language?:string;
  writer?:string[];
}

export interface FilmRepository extends ViewRepository<Film, string> {
}
export interface FilmQuery extends Query<Film, string,FilmFilter> {
}

export const filmModel: Attributes = {
  id: {
    key: true,
    length: 40
  },
  title: {
    required: true,
    length: 300,
    q: true
  },
  description: {
    length: 300,
  },
  imageUrl: {
    length: 300
  },
  trailerUrl: {
    length: 300
  },
  categories: {
    type: 'strings',
  },
  status: {
    match: 'equal',
    length: 1
  },
  directors: {
    type: 'strings',
  },
  casts: {
    type: 'strings',
  },
  productions: {
    type: 'strings',
  },
  countries: {
    type: 'strings',
  },
  language:{
    type:'string'
  },
  writer:{
    type:'strings'
  },
  createdBy: {},
  createdAt: {
    type: 'datetime'
  },
  updatedBy: {},
  updatedAt: {
    type: 'datetime'
  },

};

