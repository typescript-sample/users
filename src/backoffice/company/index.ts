import { Controller } from 'express-ext';
import { StorageRepository } from 'google-storage';
import { Delete, GenericSearchStorageService, ModelConf, StorageConf, UploadInfo } from 'one-storage';
import { BuildUrl, Generate, Log, Manager, Search } from 'onecore';
import { DB, postgres, Repository, SearchBuilder } from 'query-core';
import { TemplateMap, useQuery } from 'query-mappers';
import { UploadController, UploadService } from 'upload-express';
import {
  Company,
  CompanyFilter,
  companyModel,
  CompanyRepository,
  CompanyService,
} from './company';

export class CompanyManager extends Manager<Company, string, CompanyFilter> implements CompanyService {
  constructor(search: Search<Company, CompanyFilter>, repository: CompanyRepository) {
    super(search, repository);
  }
}

export function useBackOfficeCompanyController(log: Log, db: DB, mapper?: TemplateMap): Controller<Company, string, CompanyFilter> {
  const queryCompany = useQuery('company', mapper, companyModel, true);
  const builder = new SearchBuilder<Company, CompanyFilter>(db.query, 'company', companyModel, db.driver, queryCompany);
  const repository = new Repository<Company, string>(db, 'company', companyModel);
  const service = new CompanyManager(builder.search, repository);
  return new Controller<Company, string, CompanyFilter>(log, service);
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

export function useCompanyUploadController(log: Log, db: DB, storage: StorageRepository, deleteFile: Delete, generateId: Generate, buildUrl: BuildUrl, sizesCover: number[],
  sizesImage: number[], config?: StorageConf, model?: ModelConf, mapper?: TemplateMap): UploadController {
  const queryItems = useQuery('company', mapper, companyModel, true);
  const builder = new SearchBuilder<Company, CompanyFilter>(db.query, 'company', companyModel, postgres, queryItems);
  const repository = new Repository<Company, string>(db, 'company', companyModel);
  const service = new CompanyUploadService(builder.search, repository, storage, deleteFile, generateId, buildUrl, sizesCover, sizesImage, config, model);
  return new UploadController(log, service, service.getGalllery, generateId, sizesCover, sizesImage, 'id');
}
