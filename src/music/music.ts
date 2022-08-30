import { Attributes, Filter, Query, Repository, Service, TimeRange, ViewRepository } from 'onecore';

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
  mp3URL?: string;
}

export interface MusicRepository extends ViewRepository<Music, string> {
}
export interface MusicQuery extends Query<Music, string, MusicFilter> {
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
    type: 'strings'
  },
  releaseDate: {
    type: 'datetime'
  },
  lyric: {
  },
  imageURL: {
    length: 1500,
  },
  mp3URL: {
    length: 1500,
  }
};

export interface PlaylistFilter extends Filter {
  id?: string;
  title?: string;
  userId?: string;
}

export interface Playlist {
  id?: string;
  title?: string;
  userId?: string;
}
export interface PlaylistRepository extends Repository<Playlist, string> {
}
export interface PlaylistService extends Service<Playlist, string, PlaylistFilter> {
}
export const playlistModel: Attributes = {
  id: {
    key: true,
    length: 40
  },
  title: {
    length: 250,
  },
  userId: {
    length: 250,
  }
};
