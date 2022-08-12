import { Log, QueryController } from 'express-ext';
import { Location, LocationFilter, LocationQuery,LocationInfomation,LocationInfomationFilter,LocationInfomationQuery } from './location';

export class LocationController extends QueryController<Location, string, LocationFilter> {
  constructor(log: Log, public locationService: LocationQuery) {
    super(log, locationService);
  }
}
export class LocationInfomationController extends QueryController<LocationInfomation, string,LocationInfomationFilter> {
  constructor(log: Log, service: LocationInfomationQuery) {
    super(log, service);
  }
}