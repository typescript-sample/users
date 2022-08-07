import { Controller, Log } from 'express-ext';
import { Film, FilmFilter, FilmService } from './film';

export class BackOfficeFilmController extends Controller<Film, string, FilmFilter> {
  constructor(log: Log, private filmService: FilmService) {
    super(log, filmService);
  }
}
