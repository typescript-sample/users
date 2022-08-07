import { Controller, Log } from 'express-ext';
import { Cinema, CinemaFilter, CinemaService } from './cinema';

export class CinemaController extends Controller<Cinema, string, CinemaFilter> {
  constructor(log: Log, cinemaService: CinemaService) {
    super(log, cinemaService);
  }
}
