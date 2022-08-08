import { DB, Repository } from 'query-core';
import { Company, companyModel, CompanyRepository } from './company';

export class SqlCompanyRepository extends Repository<Company, string> implements CompanyRepository {
  constructor(db: DB) {
    super(db, 'companies', companyModel);
  }
}
