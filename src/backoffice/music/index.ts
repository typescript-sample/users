import { Controller } from 'express-ext';
import { Log, Manager, Search } from 'onecore';
import { DB, Repository, SearchBuilder } from 'query-core';
import { TemplateMap, useQuery } from 'query-mappers';
import shortid from 'shortid';
import {
  Music,
  MusicFilter,
  musicModel,
  MusicRepository,
  MusicService,
} from './music';

export class MusicManager
  extends Manager<Music, string, MusicFilter>
  implements MusicService {
  constructor(
    search: Search<Music, MusicFilter>,
    repository: MusicRepository,
  ) {
    super(search, repository);
  }
}

export function useBackOfficeMusicController(
  log: Log,
  db: DB,
  mapper?: TemplateMap
): Controller<Music, string, MusicFilter> {

  const query = useQuery('music', mapper, musicModel, true);
  const builder = new SearchBuilder<Music, MusicFilter>(
    db.query,
    'music',
    musicModel,
    db.driver,
    query
  );
  const repository = new Repository<Music, string>(db, 'music', musicModel);
  const service = new MusicManager(builder.search, repository);
  return new Controller<Music, string, MusicFilter>(log, service);
}

export function generate(): string {
  return shortid.generate();
}
