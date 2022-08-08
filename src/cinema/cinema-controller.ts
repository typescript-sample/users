import { Log, QueryController } from 'express-ext';
import { Cinema, CinemaFilter, CinemaQuery } from './cinema';

export class CinemaController extends QueryController<Cinema, string, CinemaFilter> {
  constructor(log: Log, cinemaService: CinemaQuery) {
    super(log, cinemaService);
  }
}
