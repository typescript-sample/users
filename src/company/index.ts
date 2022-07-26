import { Log, Manager, Search } from 'onecore';
import { postgres, SearchBuilder, DB } from 'query-core';
import { buildQuery } from './query';
import { TemplateMap, useQuery } from 'query-mappers';
import { Company, CompanyFilter, companyModel, CompanyRepository, CompanyService } from './company';
import { CompanyController } from './company-controller';
export * from './company';
export { CompanyController };

import { SqlCompanyRepository } from './sql-company-responsitory';

export class CompanyManager extends Manager<Company, string, CompanyFilter> implements CompanyService {
  constructor(search: Search<Company, CompanyFilter>, repository: CompanyRepository) {
    super(search, repository);

  }
}
export function useCompanyService(db: DB): CompanyService {
  const builder = new SearchBuilder<Company, CompanyFilter>(db.query, 'companies', companyModel, postgres, buildQuery);
  const repository = new SqlCompanyRepository(db);
  return new CompanyManager(builder.search, repository);
}
export function useCompanyController(log: Log, db: DB): CompanyController {
  return new CompanyController(log, useCompanyService(db));
}

// export function useCompanyService(db: DB, mapper?: TemplateMap): CompanyService {
//   const queryCompany = useQuery('companies', mapper, companyModel, true);
//   const builder = new SearchBuilder<Company, CompanyFilter>(db.query, 'companies', companyModel, postgres, queryCompany);
//   const repository = new SqlCompanyRepository(db);
//   return new CompanyManager(builder.search, repository);
// }
// export function useCompanyController(log: Log, db: DB, mapper?: TemplateMap): CompanyController {
//   return new CompanyController(log, useCompanyService(db, mapper));
// }