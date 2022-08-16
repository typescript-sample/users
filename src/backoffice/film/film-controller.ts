import { Controller, Log } from 'express-ext';
import { Film, FilmFilter, FilmService } from './film';


import { UploadController, UploadService } from 'upload-express';


export class BackOfficeFilmController extends Controller<Film, string, FilmFilter> {
  constructor(log: Log, filmService: FilmService) {
    super(log, filmService);
  }
}
export class FilmUploadController extends UploadController {
  constructor(log: Log, service: UploadService, generateId: () => string, sizesCover: number[], sizesImage: number[]) {
    super(log, service, service.getGalllery, generateId, sizesCover, sizesImage, 'id');
  }
}

