import { Request, Response } from "express";
import { Controller, handleError, Log } from "express-ext";
import { Cinema, CinemaFilter, CinemaService } from "./cinema";
import { UploadController, UploadService } from 'upload-express';
export class BackOfficeCinemaController extends Controller<Cinema, string, CinemaFilter> {
  constructor(log: Log, private cinemaService: CinemaService) {
    super(log, cinemaService);
  }
}
export class CinemaUploadController extends UploadController {
  constructor(log: Log, service: UploadService, generateId: () => string, sizesCover: number[], sizesImage: number[]) {
    super(log, service, service.getGalllery, generateId, sizesCover, sizesImage, 'id');
  }
}