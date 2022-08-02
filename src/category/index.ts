import { Log } from "express-ext";
import { Manager, Mapper, Search } from "onecore";
import { DB, SearchBuilder } from "query-core";
import { TemplateMap, useQuery } from "query-mappers";
import {
  Category,
  CategoryFilter,
  categoryModel,
  CategoryRepository,
  CategoryService,
} from "./category";
import { CategoryController } from "./category-controller";
import { SqlCategoryRepositoy } from "./sql-category-repository";

export { CategoryController };

export class CategoryManager
  extends Manager<Category, string, CategoryFilter>
  implements CategoryService
{
  constructor(
    search: Search<Category, CategoryFilter>,
    repository: CategoryRepository
  ) {
    super(search, repository);
  }
}

// Item category
export function useItemCategoryService(
  db: DB,
  mapper?: TemplateMap
): CategoryService {
  const query = useQuery("item_categories", mapper, categoryModel, true);
  const builder = new SearchBuilder<Category, CategoryFilter>(
    db.query,
    "item_categories",
    categoryModel,
    db.driver,
    query
  );
  const repository = new SqlCategoryRepositoy(db, "item_categories");
  return new CategoryManager(builder.search, repository);
}
export function useItemCategoryController(
  log: Log,
  db: DB,
  mapper?: TemplateMap
): CategoryController {
  return new CategoryController(log, useItemCategoryService(db, mapper));
}

// Film category
export function useFilmCategoryService(
  db: DB,
  mapper?: TemplateMap
): CategoryService {
  const query = useQuery("film_categories", mapper, categoryModel, true);
  const builder = new SearchBuilder<Category, CategoryFilter>(
    db.query,
    "film_categories",
    categoryModel,
    db.driver,
    query
  );
  const repository = new SqlCategoryRepositoy(db, "film_categories");
  return new CategoryManager(builder.search, repository);
}
export function useFilmCategoryController(
  log: Log,
  db: DB,
  mapper?: TemplateMap
): CategoryController {
  return new CategoryController(log, useFilmCategoryService(db, mapper));
}

// Company category
export function useCompanyCategoryService(
  db: DB,
  mapper?: TemplateMap
): CategoryService {
  const query = useQuery("company_categories", mapper, categoryModel, true);
  const builder = new SearchBuilder<Category, CategoryFilter>(
    db.query,
    "company_categories",
    categoryModel,
    db.driver,
    query
  );
  const repository = new SqlCategoryRepositoy(db, "company_categories");
  return new CategoryManager(builder.search, repository);
}
export function useCompanyCategoryController(
  log: Log,
  db: DB,
  mapper?: TemplateMap
): CategoryController {
  return new CategoryController(log, useCompanyCategoryService(db, mapper));
}
