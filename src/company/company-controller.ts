import { ViewController, Log } from 'express-ext';
import { Company, CompanyFilter, CompanyQuery } from './company';

export class CompanyController extends ViewController<Company, string, CompanyFilter> {
  constructor(log: Log, companyService: CompanyQuery) {
    super(log, companyService);
  }
}
