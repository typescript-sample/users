import { BuildUrl, Delete, Generate, Log, Manager, Search } from "onecore";
import { StorageRepository } from "google-storage";
import { DB, postgres, Repository, SearchBuilder } from "query-core";
import { TemplateMap, useQuery } from 'query-mappers';
import { UploadService } from "upload-express";
import shortid from 'shortid';
import { Location, LocationFilter, locationModel, LocationRepository, LocationService} from './location';
import { BackOfficeLocationController,LocationUploadController } from './location-controller';
import { GenericSearchStorageService, ModelConf, StorageConf, UploadInfo } from "one-storage";
export { BackOfficeLocationController };

export class LocationManager extends Manager<Location, string, LocationFilter> implements LocationService {
  constructor(search: Search<Location, LocationFilter>, repository: LocationRepository) {
    super(search, repository);
  }
}

export function useBackOfficeLocationController( log: Log, db: DB, mapper?: TemplateMap ): BackOfficeLocationController {
  const query = useQuery('location', mapper, locationModel, true);
  const builder = new SearchBuilder<Location, LocationFilter>(  db.query, 'location',  locationModel, db.driver, query );
  const repository = new Repository<Location, string>(db,'location' , locationModel);
  const service=new LocationManager(builder.search, repository);
  return new BackOfficeLocationController(log, service);
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
    this.getGalllery = this.getGalllery.bind(this)
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
export function useLocationUploadService(db: DB, storage: StorageRepository, deleteFile: Delete, generateId: Generate, buildUrl: BuildUrl, sizesCover: number[],
  sizesImage: number[], config?: StorageConf, model?: ModelConf, mapper?: TemplateMap): UploadService {
  const queryItems = useQuery('location', mapper, locationModel, true);
  const builder = new SearchBuilder<Location, LocationFilter>(db.query, 'location', locationModel, postgres, queryItems);
  const repository = new Repository<Location, string>(db, 'location', locationModel);
  return new LocationUploadService(builder.search, repository, storage, deleteFile, generateId, buildUrl, sizesCover, sizesImage, config, model);
}

export function useLocationUploadController(log: Log, db: DB, storage: StorageRepository, deleteFile: Delete, generateId: Generate, buildUrl: BuildUrl, sizesCover: number[],
  sizesImage: number[], config?: StorageConf, model?: ModelConf, mapper?: TemplateMap): LocationUploadController {
  return new LocationUploadController(log, useLocationUploadService(db, storage, deleteFile, generateId, buildUrl, sizesCover, sizesImage, config, model, mapper), generateId, sizesCover, sizesImage);
}
