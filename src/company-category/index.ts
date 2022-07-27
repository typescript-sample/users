
import { Log } from "express-ext";
import { Manager, Mapper, Search } from "onecore";
import { DB, SearchBuilder } from "query-core";
import { TemplateMap, useQuery } from "query-mappers";
import { CompanyCategory, CompanyCategoryFilter, companyCategoryModel, CompanyCategoryRepository, CompanyCategoryService } from "./company-category";
import { CompanyCategoryController } from "./company-category-controller";
import { SqlCompanyCategoryRepositoy } from "./sql-company-category-repository";

export { CompanyCategoryController };

export class CompanyCategoryManager extends Manager<CompanyCategory, string, CompanyCategoryFilter> implements CompanyCategoryService{
  constructor(search: Search<CompanyCategory, CompanyCategoryFilter>, repository: CompanyCategoryRepository) {
    super(search, repository);
  }
}
export function useCompanyCategoryService(db: DB, mapper?: TemplateMap): CompanyCategoryService {
  const query = useQuery('company_categories', mapper, companyCategoryModel, true);
  const builder = new SearchBuilder<CompanyCategory, CompanyCategoryFilter>(db.query, 'company_categories', companyCategoryModel, db.driver,query);
  const repository = new SqlCompanyCategoryRepositoy(db);
  return new CompanyCategoryManager(builder.search, repository);
  
}
export function useCompanyCategoryController(log: Log, db: DB, mapper?: TemplateMap): CompanyCategoryController {
  return new CompanyCategoryController(log, useCompanyCategoryService(db, mapper));
}
