import { Controller, Log } from 'express-ext';
import { Location, LocationFilter, LocationService } from './location';

export class LocationController extends Controller<Location, string, LocationFilter> {
  constructor(log: Log, public locationService: LocationService) {
    super(log, locationService);
  }
}
