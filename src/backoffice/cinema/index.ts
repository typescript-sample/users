import { Controller } from 'express-ext';
import { StorageRepository } from 'google-storage';
import { Delete, GenericSearchStorageService, ModelConf, StorageConf, UploadInfo } from 'one-storage';
import { BuildUrl, Generate, Log, Manager, Search } from 'onecore';
import { DB, postgres, Repository, SearchBuilder } from 'query-core';
import { TemplateMap, useQuery } from 'query-mappers';
import shortid from 'shortid';
import { UploadController, UploadService } from 'upload-express';
import {
  Cinema,
  CinemaFilter,
  cinemaModel,
  CinemaRepository,
  CinemaService,
} from './cinema';

export class CinemaManager
  extends Manager<Cinema, string, CinemaFilter>
  implements CinemaService {
  constructor(
    search: Search<Cinema, CinemaFilter>,
    repository: CinemaRepository,
  ) {
    super(search, repository);
  }
}

export function useBackOfficeCinemaController(
  log: Log,
  db: DB,
  mapper?: TemplateMap
): Controller<Cinema, string, CinemaFilter> {

  const query = useQuery('cinema', mapper, cinemaModel, true);
  const builder = new SearchBuilder<Cinema, CinemaFilter>(
    db.query,
    'cinema',
    cinemaModel,
    db.driver,
    query
  );
  const repository = new Repository<Cinema, string>(db, 'cinema', cinemaModel);
  const service = new CinemaManager(builder.search, repository);
  return new Controller<Cinema, string, CinemaFilter>(log, service);
}

export function generate(): string {
  return shortid.generate();
}

export class CinemaUploadService extends GenericSearchStorageService<Cinema, string, CinemaFilter> implements UploadService {
  constructor(
    search: Search<Cinema, CinemaFilter>,
    repository: CinemaRepository,
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
    this.getGalllery = this.getGalllery.bind(this);
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

export function useCinemaUploadController(log: Log, db: DB, storage: StorageRepository, deleteFile: Delete, generateId: Generate, buildUrl: BuildUrl, sizesCover: number[],
  sizesImage: number[], config?: StorageConf, model?: ModelConf, mapper?: TemplateMap): UploadController {
  const queryItems = useQuery('cinema', mapper, cinemaModel, true);
  const builder = new SearchBuilder<Cinema, CinemaFilter>(db.query, 'cinema', cinemaModel, postgres, queryItems);
  const repository = new Repository<Cinema, string>(db, 'cinema', cinemaModel);
  const service = new CinemaUploadService(builder.search, repository, storage, deleteFile, generateId, buildUrl, sizesCover, sizesImage, config, model);
  return new UploadController(log, service, generateId, sizesCover, sizesImage, 'id');
}
