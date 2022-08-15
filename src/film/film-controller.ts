import { Log, QueryController } from 'express-ext';
import { UploadController, UploadService } from 'upload-express';
import { Film, FilmFilter, FilmQuery } from './film';

export class FilmController extends QueryController<Film, string, FilmFilter> {
  constructor(log: Log, filmService: FilmQuery) {
    super(log, filmService);
  }
}
export class FilmUploadController extends UploadController {
  constructor(log: Log, service: UploadService, generateId: () => string, sizesCover: number[], sizesImage: number[]) {
    super(log, service, service.getGalllery, generateId, sizesCover, sizesImage, 'id');
  }
}

