import { QueryController, Log } from 'express-ext';

import { Company, CompanyFilter, CompanyQuery } from './company';

export class CompanyController extends QueryController<Company, string, CompanyFilter> {
  constructor(log: Log, companyService: CompanyQuery) {
    super(log, companyService);
  }
}

