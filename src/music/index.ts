import { Log, SavedController } from 'express-ext';
import { SavedRepository, SavedService, Search, ViewSearchManager } from 'onecore';
import { ArrayRepository } from 'pg-extension';
import { DB, QueryRepository, Repository, SearchBuilder } from 'query-core';
import { TemplateMap, useQuery } from 'query-mappers';

import {
  Music,
  MusicFilter,
  musicModel,
  MusicRepository,
  MusicQuery,
} from './music';
import { MusicController } from './music-controller';

export { MusicController };

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
  const saveMusicRepository = new ArrayRepository<string, string>(db.query, db.exec, 'savedmusic', 'musics', 'id');
  const service = new MusicService(builder.search, repository, saveMusicRepository, savedMusicMax);
  return new MusicController(log, service);
}

export function useSavedMusicsController(log: Log, db: DB): SavedController<Music> {
  const savedRepository = new ArrayRepository<string, string>(db.query, db.exec, 'savedmusic', 'musics', 'id');
  const repository = new QueryRepository<Music, string>(db, 'music', musicModel);
  const service = new SavedService<string, Music>(savedRepository, repository.query, 50);
  return new SavedController<Music>(log, service, 'musicId', 'id');
}