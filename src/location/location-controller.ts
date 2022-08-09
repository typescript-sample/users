import { Controller, Log, ViewController } from 'express-ext';
import { Location, LocationFilter, LocationQuery } from './location';

export class LocationController extends ViewController<Location, string, LocationFilter> {
  constructor(log: Log, public locationService: LocationQuery) {
    super(log, locationService);
  }
}
