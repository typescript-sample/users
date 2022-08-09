import { Controller, Log } from 'express-ext';
import { Company, CompanyFilter, CompanyService } from './company';

export class BackOfficeCompanyController extends Controller<Company, string, CompanyFilter> {
  constructor(log: Log, companyService: CompanyService) {
    super(log, companyService);
  }
}
