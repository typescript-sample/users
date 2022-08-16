import { Controller, Log } from 'express-ext';
import { Location, LocationFilter, LocationService } from './location';
import { UploadController, UploadService } from 'upload-express';
export class BackOfficeLocationController extends Controller<Location, string, LocationFilter> {
  constructor(log: Log, public locationService: LocationService) {
    super(log, locationService);
  }
}
export class LocationUploadController extends UploadController { 
  constructor(log: Log, service: UploadService, generateId: () => string, sizesCover: number[], sizesImage: number[]) {
    super(log, service, service.getGalllery, generateId, sizesCover, sizesImage, 'id');
  }
}
