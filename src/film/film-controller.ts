import { Controller, Log } from 'express-ext';
import { Film, FilmFilter, FilmService } from './film';

export class FilmController extends Controller<Film, string, FilmFilter> {
  constructor(log: Log, private filmService: FilmService) {
    super(log, filmService);
  }
}
