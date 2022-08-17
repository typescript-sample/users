import { BuildUrl, Generate, Log, Manager, Search } from "onecore";
import { StorageRepository } from "google-storage";
import { DB, postgres, Repository, SearchBuilder } from "query-core";
import { TemplateMap, useQuery } from 'query-mappers';
import { UploadService } from "upload-express";
import { GenericSearchStorageService, ModelConf, Delete, StorageConf, UploadInfo } from 'one-storage';
import {
  Company,
  CompanyFilter,
  companyModel,
  CompanyRepository,
  CompanyService,
} from './company';
import { BackOfficeCompanyController, CompanyUploadController } from './company-controller';
export * from './company-controller';
export { BackOfficeCompanyController };

export class CompanyManager extends Manager<Company, string, CompanyFilter> implements CompanyService {
  constructor(search: Search<Company, CompanyFilter>, repository: CompanyRepository) {
    super(search, repository);
  }
}

export function useBackOfficeCompanyController(log: Log, db: DB, mapper?: TemplateMap): BackOfficeCompanyController {
  const queryCompany = useQuery('company', mapper, companyModel, true);
  const builder = new SearchBuilder<Company, CompanyFilter>(db.query, 'company', companyModel, db.driver, queryCompany);
  const repository = new Repository<Company, string>(db, 'company', companyModel);
  const service = new CompanyManager(builder.search, repository);
  return new BackOfficeCompanyController(log, service);
}
export class CompanyUploadService extends GenericSearchStorageService<Company, string, CompanyFilter> implements UploadService {
  constructor(
    search: Search<Company, CompanyFilter>,
    repository: CompanyRepository,
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

export function useCompanyUploadController(log: Log, db: DB, storage: StorageRepository, deleteFile: Delete, generateId: Generate, buildUrl: BuildUrl, sizesCover: number[],
  sizesImage: number[], config?: StorageConf, model?: ModelConf, mapper?: TemplateMap): CompanyUploadController {
  const queryItems = useQuery('company', mapper, companyModel, true);
  const builder = new SearchBuilder<Company, CompanyFilter>(db.query, 'company', companyModel, postgres, queryItems);
  const repository = new Repository<Company, string>(db, 'company', companyModel);
  const controller = new CompanyUploadService(builder.search, repository, storage, deleteFile, generateId, buildUrl, sizesCover, sizesImage, config, model);
  return new CompanyUploadController(log, controller, generateId, sizesCover, sizesImage);
}
