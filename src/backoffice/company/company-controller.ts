import { Controller, Log } from 'express-ext';
import { Company, CompanyFilter, CompanyService } from './company';
import { UploadController, UploadService } from 'upload-express';
export class BackOfficeCompanyController extends Controller<Company, string, CompanyFilter> {
  constructor(log: Log, companyService: CompanyService) {
    super(log, companyService);
  }
}
export class CompanyUploadController extends UploadController {
  constructor(log: Log, service: UploadService, generateId: () => string, sizesCover: number[], sizesImage: number[]) {
    super(log, service, service.getGalllery, generateId, sizesCover, sizesImage, 'id');
  }
}
