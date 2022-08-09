import { Log, QueryController } from 'express-ext';
import { Film, FilmFilter, FilmQuery } from './film';

export class FilmController extends QueryController<Film, string, FilmFilter> {
  constructor(log: Log, filmService: FilmQuery) {
    super(log, filmService);
  }
}
