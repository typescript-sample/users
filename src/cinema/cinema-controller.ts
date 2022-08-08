import { Controller, Log, ViewController } from 'express-ext';
import { Cinema, CinemaFilter, CinemaQuery } from './cinema';

export class CinemaController extends ViewController<Cinema, string, CinemaFilter> {
  constructor(log: Log, cinemaService: CinemaQuery) {
    super(log, cinemaService);
  }
}
