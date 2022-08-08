import { Attributes, Filter, Info10, Repository, Service } from 'onecore';

export interface FilmFilter extends Filter {
  filmId?: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  trailerUrl?: string;
  status?: string;
  categories?: string[];
  directors?: string[];
  filmcast?: string[];
  productions?: string[];
  countries?: string[];
}

export interface Film {
  filmId: string;
  title: string;
  status: string;
  description?: string;
  imageUrl?: string;
  trailerUrl?: string;
  categories?: string[];
  directors?: string[];
  filmcast?: string[];
  productions?: string[];
  countries?: string[];
  info?: Info10;
}

export interface FilmRepository extends Repository<Film, string> {
}
export interface FilmService extends Service<Film, string, FilmFilter> {
}

export const filmModel: Attributes = {
  filmId: {
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
    type: 'primitives',
  },
  status: {
    match: 'equal',
    length: 1
  },
  directors: {
    type: 'primitives',
  },
  filmcast: {
    type: 'primitives',
  },
  productions: {
    type: 'primitives',
  },
  countries: {
    type: 'primitives',
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
