import { Log, Manager, Search } from 'onecore';
import { DB, SearchBuilder } from 'query-core';
import { TemplateMap, useQuery } from 'query-mappers';
import {
  Company,
  CompanyFilter,
  companyModel,
  CompanyRepository,
  CompanyService,
} from './company';
import { BackOfficeCompanyController } from './company-controller';
import { SqlCompanyRepository } from './sql-company-repository';
export * from './company-controller';
export { BackOfficeCompanyController };

export class CompanyManager extends Manager<Company, string, CompanyFilter> implements CompanyService {
  constructor(search: Search<Company, CompanyFilter>, repository: CompanyRepository) {
    super(search, repository);
  }
}

export function useBackOfficeCompanyService(db: DB, mapper?: TemplateMap): CompanyService {
  const queryCompany = useQuery('companies', mapper, companyModel, true);
  const builder = new SearchBuilder<Company, CompanyFilter>(db.query, 'companies', companyModel,  db.driver, queryCompany);
  const repository = new SqlCompanyRepository(db);
  return new CompanyManager(builder.search, repository );
}
export function useBackOfficeCompanyController(log: Log, db: DB, mapper?: TemplateMap): BackOfficeCompanyController {
  return new BackOfficeCompanyController(log, useBackOfficeCompanyService(db, mapper));
}
