import { Controller, SavedController } from 'express-ext';
import { Log, Manager, SavedRepository, SavedService, Search, ViewSearchManager } from 'onecore';
import { ArrayRepository } from 'pg-extension';
import { DB, QueryRepository, Repository, SearchBuilder } from 'query-core';
import { TemplateMap, useQuery } from 'query-mappers';

import {
  Music,
  MusicFilter,
  musicModel,
  MusicRepository,
  MusicQuery,
  Playlist,
  PlaylistFilter,
  PlaylistService,
  PlaylistRepository,
  playlistModel,
} from './music';
import { QueryController } from 'express-ext';

export class MusicController extends QueryController<Music, string, MusicFilter> {
  constructor(log: Log, mucsicService: MusicQuery) {
    super(log, mucsicService);
  }
}


export class MusicService extends ViewSearchManager<Music, string, MusicFilter> implements MusicQuery {
  constructor(
    search: Search<Music, MusicFilter>,
    protected repository: MusicRepository,
    protected saveItemsRepository: SavedRepository<string>,
    public max: number
  ) {
    super(search, repository);
  }

}
export function useMusicController(log: Log, db: DB, mapper?: TemplateMap): MusicController {
  const savedMusicMax = 50;
  const query = useQuery('music', mapper, musicModel, true);
  const builder = new SearchBuilder<Music, MusicFilter>(db.query, 'music', musicModel, db.driver, query);
  const repository = new Repository<Music, string>(db, 'music', musicModel);
  const saveMusicRepository = new ArrayRepository<string, string>(db.query, db.exec, 'savedmusic', 'songs', 'id');
  const service = new MusicService(builder.search, repository, saveMusicRepository, savedMusicMax);
  return new MusicController(log, service);
}

export function useSavedMusicsController(log: Log, db: DB): SavedController<Music> {
  const savedRepository = new ArrayRepository<string, string>(db.query, db.exec, 'savedmusic', 'songs', 'id');
  const repository = new QueryRepository<Music, string>(db, 'music', musicModel);
  const service = new SavedService<string, Music>(savedRepository, repository.query, 50);
  return new SavedController<Music>(log, service, 'itemId', 'id');
}
export function useSavedListSongController(log: Log, db: DB): SavedController<Music> {
  const savedRepository = new ArrayRepository<string, string>(db.query, db.exec, 'listsong', 'songs', 'id');
  const repository = new QueryRepository<Music, string>(db, 'music', musicModel);
  const service = new SavedService<string, Music>(savedRepository, repository.query, 50);
  return new SavedController<Music>(log, service, 'itemId', 'id');
}


export class PlaylistController extends Controller<Playlist, string, PlaylistFilter> {
  constructor(log: Log, private musicService: PlaylistService) {
    super(log, musicService);
  }
}

export class PlaylistManager
  extends Manager<Playlist, string, PlaylistFilter>
  implements PlaylistService {
  constructor(
    search: Search<Playlist, PlaylistFilter>,
    repository: PlaylistRepository,
  ) {
    super(search, repository);
  }

}

export function usePlaylistController(
  log: Log,
  db: DB,
  mapper?: TemplateMap
): PlaylistController {
  const query = useQuery("playlist", mapper, playlistModel, true);
  const builder = new SearchBuilder<Playlist, PlaylistFilter>(
    db.query,
    "playlist",
    playlistModel,
    db.driver,
    query
  );
  const repository = new Repository<Music, string>(db, "playlist", playlistModel);
  const service = new PlaylistManager(builder.search, repository);
  return new PlaylistController(log, service);
}