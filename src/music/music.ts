import { Attributes, Filter, Query, TimeRange, ViewRepository } from 'onecore';

export interface MusicFilter extends Filter {
  id?: string;
  name?: string;
  author?: string[];
  releaseDate?: Date;
  duration?: TimeRange;
  lyric?: string;
}

export interface Music {
  id?: string;
  name?: string;
  author?: string[];
  releaseDate?: Date;
  duration?: TimeRange;
  lyric?: string;
  imageURL?: string;
}

export interface MusicRepository extends ViewRepository<Music, string> {
}
export interface MusicQuery extends Query<Music, string,MusicFilter> {
}

export const musicModel: Attributes = {
  id: {
    key: true,
    length: 40
  },
  name: {
    required: true,
    length: 300,
    q: true
  },
  author: {
    type: 'strings',
  },
  releaseDate: {
    type: 'datetime'
  },
  lyric: {
  },
};

