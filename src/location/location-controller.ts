import { Log, QueryController } from 'express-ext';
import { UploadController, UploadService } from 'upload-express';
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
export class LocationUploadController extends UploadController { 
  constructor(log: Log, service: UploadService, generateId: () => string, sizesCover: number[], sizesImage: number[]) {
    super(log, service, service.getGalllery, generateId, sizesCover, sizesImage, 'id');
  }
}

