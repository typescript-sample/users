import { DB, Repository } from "query-core";
import { CompanyCategory, companyCategoryModel, CompanyCategoryRepository } from "./company-category";

export class SqlCompanyCategoryRepositoy extends Repository<CompanyCategory, string> implements CompanyCategoryRepository{
  constructor(db:DB){
    super(db, 'company_categories', companyCategoryModel);
  }
}