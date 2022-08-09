import { Log, Manager, Search } from 'onecore';
import { DB, Repository, SearchBuilder } from 'query-core';
import { TemplateMap, useQuery } from 'query-mappers';
import {
  Company,
  CompanyFilter,
  companyModel,
  CompanyRepository,
  CompanyService,
} from './company';
import { BackOfficeCompanyController } from './company-controller';
export * from './company-controller';
export { BackOfficeCompanyController };

export class CompanyManager extends Manager<Company, string, CompanyFilter> implements CompanyService {
  constructor(search: Search<Company, CompanyFilter>, repository: CompanyRepository) {
    super(search, repository);
  }
}

export function useBackOfficeCompanyController(log: Log, db: DB, mapper?: TemplateMap): BackOfficeCompanyController {
  const queryCompany = useQuery('companies', mapper, companyModel, true);
  const builder = new SearchBuilder<Company, CompanyFilter>(db.query, 'companies', companyModel,  db.driver, queryCompany);
  const repository = new Repository<Company, string>(db, 'companies', companyModel);
  const service = new CompanyManager(builder.search, repository );
  return new BackOfficeCompanyController(log, service);
}
