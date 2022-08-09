import { Log, QueryController } from 'express-ext';
import { Location, LocationFilter, LocationQuery } from './location';

export class LocationController extends QueryController<Location, string, LocationFilter> {
  constructor(log: Log, public locationService: LocationQuery) {
    super(log, locationService);
  }
}
