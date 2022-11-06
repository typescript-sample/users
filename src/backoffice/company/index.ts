import { buildId, Controller, handleError } from 'express-ext'
import { StorageRepository } from 'google-storage'
import { Delete, GenericSearchStorageService, ModelConf, StorageConf, UploadInfo } from 'one-storage'
import { BuildUrl, Generate, Log, Manager, Search } from 'onecore'
import { buildDollarParam, DB, postgres, Repository, SearchBuilder, Manager as QryCoreManager, Attributes } from 'query-core'
import { TemplateMap, useQuery } from 'query-mappers'
import { UploadController, UploadService } from 'upload-express'
import { Request, Response } from 'express'
import { buildToSaveBatch, Statement } from 'pg-extension'
import { Company, CompanyFilter, companyModel, CompanyRepository, CompanyService, CompanyUser, companyUserModel } from './company'

export class CompanyRepositoryImpl extends Repository<Company, string> implements CompanyRepository {
  constructor(private manager: QryCoreManager, table: string, attrs: Attributes) {
    super(manager, table, attrs)
  }

  assignUsers(companyUsers: CompanyUser[]): Promise<number> {
    const stmt = buildToSaveBatch<CompanyUser>(companyUsers, 'company_users', companyUserModel, undefined, buildDollarParam)
    return stmt ? this.manager.execBatch(stmt, true) : Promise.resolve(0)
  }

  deassignUsers(companyId: string, userIds: string[]): Promise<number> {
    // TODO:
    //   Update the framework to support
    //     - Delete a list of rows from database,
    //     - or pass an array values as a parameter when query
    const stmts: Statement[] = []

    userIds.forEach(usrId => stmts.push({
      query: `delete from company_users where company_id = ${this.param(1)} and user_id = ${this.param(2)}`,
      params: [companyId, usrId]
    }))

    return this.manager.execBatch(stmts, true)
  }
} // End of CompanyRepositoryImpl

export class CompanyManager extends Manager<Company, string, CompanyFilter> implements CompanyService {
  constructor(search: Search<Company, CompanyFilter>, public repository: CompanyRepository) {
    super(search, repository)
    this.assignUsers = this.assignUsers.bind(this)
    this.deassignUsers = this.deassignUsers.bind(this)
  }

  assignUsers = (companyUsers: CompanyUser[]): Promise<number> => this.repository.assignUsers(companyUsers)
  deassignUsers = (companyId: string, userIds: string[]): Promise<number> => this.repository.deassignUsers(companyId, userIds)
} // End of CompanyManager

export class BackOfficeCompanyController extends Controller<Company, string, CompanyFilter> {
  constructor(log: Log, public service: CompanyService) {
    super(log, service)
    this.assignUsers = this.assignUsers.bind(this)
    this.deassignUsers = this.deassignUsers.bind(this)
  }

  assignUsers(req: Request, res: Response) {
    const companyId = buildId<string>(req)
    const userIds = req.body as string[]
    let isValid = true

    if (companyId === undefined || companyId.length === 0) {
      res.status(400).send('The company ID cannot be empty')
      isValid = false
    }

    if (!userIds || userIds.length === 0) {
      res.status(400).send('The users cannot be null or empty')
      isValid = false
    }

    if (!isValid) {
      res.end()
      return
    }

    const model: CompanyUser[] = []
    userIds.forEach(userId => model.push({companyId: companyId || '', userId}))
    
    this.service
        .assignUsers(model)
        .then(affectedRows => res.status(affectedRows > 0 ? 201 : affectedRows === 0 ? 404 : 409).json(affectedRows).end())
        .catch(reason => handleError(reason, res, this.log))
  }

  deassignUsers(req: Request, res: Response) {
    const companyId = buildId<string>(req)
    const userIds = req.body as string[]
    let isValid = true

    if (companyId === undefined || companyId.length === 0) {
      res.status(400).send('The company ID cannot be empty')
      isValid = false
    }

    if (!userIds || userIds.length === 0) {
      res.status(400).send('The users cannot be null or empty')
      isValid = false
    }

    if (!isValid) {
      res.end()
      return
    }

    this.service
        .deassignUsers(companyId || '', userIds)
        .then(affectedRows => res.status(affectedRows > 0 ? 201 : affectedRows === 0 ? 404 : 409).json(affectedRows).end())
        .catch(reason => handleError(reason, res, this.log))
  }
} // End of BackOfficeCompanyController

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
    super(search, repository, storage, deleteFile, generateId, buildUrl, sizesCover, sizesImage, config, model)
    this.getGalllery = this.getGalllery.bind(this)
  }
  
  async getGalllery(id: string): Promise<UploadInfo[]> {
    const companyInfo = await this.repository.load(id)
    return companyInfo ? ((companyInfo as any)[this.model.gallery]) : []
  }
} // End of CompanyUploadService

export function useBackOfficeCompanyController(log: Log, db: DB, mapper?: TemplateMap): BackOfficeCompanyController {
  const queryCompany = useQuery('company', mapper, companyModel, true)
  const builder = new SearchBuilder<Company, CompanyFilter>(db.query, 'company', companyModel, db.driver, queryCompany)
  const repository = new CompanyRepositoryImpl(db, 'company', companyModel)
  const service = new CompanyManager(builder.search, repository)
  return new BackOfficeCompanyController(log, service)
}

export function useCompanyUploadController(log: Log, db: DB, storage: StorageRepository, deleteFile: Delete, generateId: Generate, buildUrl: BuildUrl, sizesCover: number[],
  sizesImage: number[], config?: StorageConf, model?: ModelConf, mapper?: TemplateMap): UploadController {
  const queryItems = useQuery('company', mapper, companyModel, true)
  const builder = new SearchBuilder<Company, CompanyFilter>(db.query, 'company', companyModel, postgres, queryItems)
  const repository = new CompanyRepositoryImpl(db, 'company', companyModel)
  const service = new CompanyUploadService(builder.search, repository, storage, deleteFile, generateId, buildUrl, sizesCover, sizesImage, config, model)
  return new UploadController(log, service,  generateId, sizesCover, sizesImage, 'id')
}
