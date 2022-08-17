import { Log, QueryController } from 'express-ext';
import { Music, MusicFilter, MusicQuery } from './music';

export class MusicController extends QueryController<Music, string, MusicFilter> {
  constructor(log: Log, mucsicService: MusicQuery) {
    super(log, mucsicService);
  }
}
