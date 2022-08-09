import { Log, ViewController } from 'express-ext';
import { Film, FilmFilter, FilmQuery } from './film';

export class FilmController extends ViewController<Film, string, FilmFilter> {
  constructor(log: Log, filmService: FilmQuery) {
    super(log, filmService);
  }
}
