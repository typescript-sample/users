import { Controller } from 'express-ext';
import { StorageRepository } from 'google-storage';
import { GenericSearchStorageService, ModelConf, StorageConf, UploadInfo } from 'one-storage';
import { BuildUrl, Delete, Generate, Log, Manager, Search } from 'onecore';
import { DB, postgres, Repository, SearchBuilder } from 'query-core';
import { TemplateMap, useQuery } from 'query-mappers';
import shortid from 'shortid';
import { UploadController, UploadService } from 'upload-express';
import { Location, LocationFilter, locationModel, LocationRepository, LocationService} from './location';

export class LocationManager extends Manager<Location, string, LocationFilter> implements LocationService {
  constructor(search: Search<Location, LocationFilter>, repository: LocationRepository) {
    super(search, repository);
  }
}

export function useBackOfficeLocationController( log: Log, db: DB, mapper?: TemplateMap ): Controller<Location, string, LocationFilter> {
  const query = useQuery('location', mapper, locationModel, true);
  const builder = new SearchBuilder<Location, LocationFilter>(  db.query, 'location',  locationModel, db.driver, query );
  const repository = new Repository<Location, string>(db, 'location' , locationModel);
  const service = new LocationManager(builder.search, repository);
  return new Controller<Location, string, LocationFilter>(log, service);
}

export function generate(): string {
  return shortid.generate();
}

export class LocationUploadService extends GenericSearchStorageService<Location, string, LocationFilter> implements UploadService {
  constructor(
    search: Search<Location, LocationFilter>,
    repository: LocationRepository,
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

export function useLocationUploadController(log: Log, db: DB, storage: StorageRepository, deleteFile: Delete, generateId: Generate, buildUrl: BuildUrl, sizesCover: number[],
  sizesImage: number[], config?: StorageConf, model?: ModelConf, mapper?: TemplateMap): UploadController {
  const queryItems = useQuery('location', mapper, locationModel, true);
  const builder = new SearchBuilder<Location, LocationFilter>(db.query, 'location', locationModel, postgres, queryItems);
  const repository = new Repository<Location, string>(db, 'location', locationModel);
  const service = new LocationUploadService(builder.search, repository, storage, deleteFile, generateId, buildUrl, sizesCover, sizesImage, config, model);
  return new UploadController(log, service, service.getGalllery, generateId, sizesCover, sizesImage);
}
