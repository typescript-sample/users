
import { Log } from 'express-ext';
import { BuildUrl, Generate, Manager, Search } from 'onecore';
import { DB, postgres, Repository, SearchBuilder } from 'query-core';
import { TemplateMap, useQuery } from 'query-mappers';
import { GenericSearchStorageService, ModelConf, Delete, StorageConf, UploadInfo } from 'one-storage';
import { StorageRepository } from 'google-storage';
import {
  Film,
  FilmFilter,
  filmModel,
  FilmRepository,
  FilmService
} from './film';
import { BackOfficeFilmController, FilmUploadController } from './film-controller';
import { UploadService } from 'upload-express';

export { BackOfficeFilmController };

export class FilmManager
  extends Manager<Film, string, FilmFilter>
  implements FilmService {
  constructor(
    search: Search<Film, FilmFilter>,
    repository: FilmRepository,
    protected saveDirectors: (values: string[]) => Promise<number>,
    protected saveCast: (values: string[]) => Promise<number>,
    protected saveProductions: (values: string[]) => Promise<number>,
    protected saveCountries: (values: string[]) => Promise<number>
  ) {
    super(search, repository);
  }
  insert(film: Film, ctx?: any): Promise<number> {
    if (film.directors && film.directors.length > 0) {
      this.saveDirectors(film.directors);
    }
    if (film.casts && film.casts.length > 0) {
      this.saveCast(film.casts);
    }
    if (film.productions && film.productions.length > 0) {
      this.saveProductions(film.productions);
    }
    if (film.countries && film.countries.length > 0) {
      this.saveCountries(film.countries);
    }
    return this.repository.insert(film, ctx);
  }
  update(film: Film, ctx?: any): Promise<number> {
    if (film.directors && film.directors.length > 0) {
      this.saveDirectors(film.directors);
    }
    if (film.casts && film.casts.length > 0) {
      this.saveCast(film.casts);
    }
    if (film.productions && film.productions.length > 0) {
      this.saveProductions(film.productions);
    }
    if (film.countries && film.countries.length > 0) {
      this.saveCountries(film.countries);
    }
    return this.repository.update(film, ctx);
  }
  patch(film: Film, ctx?: any): Promise<number> {
    if (film.directors && film.directors.length > 0) {
      this.saveDirectors(film.directors);
    }
    if (film.casts && film.casts.length > 0) {
      this.saveCast(film.casts);
    }
    if (film.productions && film.productions.length > 0) {
      this.saveProductions(film.productions);
    }
    if (film.countries && film.countries.length > 0) {
      this.saveCountries(film.countries);
    }
    return this.repository.patch
      ? this.repository.patch(film, ctx)
      : Promise.resolve(-1);
  }
}

export function useBackOfficeFilmController(
  log: Log,
  db: DB,
  saveDirectors: (values: string[]) => Promise<number>,
  saveCast: (values: string[]) => Promise<number>,
  saveProductions: (values: string[]) => Promise<number>,
  saveCountries: (values: string[]) => Promise<number>,
  mapper?: TemplateMap
): BackOfficeFilmController {
  const query = useQuery('film', mapper, filmModel, true);
  const builder = new SearchBuilder<Film, FilmFilter>(
    db.query,
    'film',
    filmModel,
    db.driver,
    query
  );
  const repository = new Repository<Film, string>(db, 'film',filmModel);
  const service = new FilmManager(
    builder.search,
    repository,
    saveDirectors,
    saveCast,
    saveProductions,
    saveCountries
  );
  return new BackOfficeFilmController(
    log,
    service
  );
}
export class FilmUploadService extends GenericSearchStorageService<Film, string, FilmFilter> implements UploadService {
  constructor(
    search: Search<Film, FilmFilter>,
    repository: FilmRepository,
    storage: StorageRepository,
    deleteFile: Delete,
    generateId: Generate,
    buildUrl: BuildUrl,
    sizesCover: number[],
    sizesImage: number[],
    config?: StorageConf,
    model?: ModelConf
  ) {
    super(search, repository, storage, deleteFile, generateId, buildUrl, sizesCover, sizesImage, config, model);
  }
  async getGalllery(id: string): Promise<UploadInfo[]> {
    return this.repository.load(id).then((item) => {
      if (item) {
        return (item as any)[this.model.gallery];
      }
      return [];
    });
  }
}

export function useFilmUploadController(log: Log, db: DB, storage: StorageRepository, deleteFile: Delete, generateId: Generate, buildUrl: BuildUrl, sizesCover: number[],
  sizesImage: number[], config?: StorageConf, model?: ModelConf, mapper?: TemplateMap): FilmUploadController {
    const queryItems = useQuery('film', mapper, filmModel, true);
    const builder = new SearchBuilder<Film, FilmFilter>(db.query, 'film', filmModel, postgres, queryItems);
    const repository = new Repository<Film, string>(db, 'film', filmModel);
    const controller = new FilmUploadService(builder.search, repository, storage, deleteFile, generateId, buildUrl, sizesCover, sizesImage, config, model);
  return new FilmUploadController(log,controller, generateId, sizesCover, sizesImage);
}
