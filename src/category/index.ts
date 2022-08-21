import { Controller, Log } from 'express-ext';
import { Manager, Search } from 'onecore';
import { DB, Repository, SearchBuilder } from 'query-core';
import { TemplateMap, useQuery } from 'query-mappers';
import {
  Category,
  CategoryFilter,
  categoryModel,
  CategoryRepository,
  CategoryService,
} from './category';

export class CategoryManager
  extends Manager<Category, string, CategoryFilter>
  implements CategoryService {
  constructor(
    search: Search<Category, CategoryFilter>,
    repository: CategoryRepository
  ) {
    super(search, repository);
  }
}

export class CategoryController extends Controller<Category, string, CategoryFilter> {
  constructor(log: Log, categoryService: CategoryService) {
    super(log, categoryService);
    this.array = ['status'];
  }
}
// Item category
export function useItemCategoryController(
  log: Log,
  db: DB,
  mapper?: TemplateMap
): CategoryController {
  const query = useQuery('itemcategory', mapper, categoryModel, true);
  const builder = new SearchBuilder<Category, CategoryFilter>(
    db.query,
    'itemcategory',
    categoryModel,
    db.driver,
    query
  );
  const repository = new Repository<Category, string>(db, 'itemcategory', categoryModel);
  const service = new CategoryManager(builder.search, repository);
  return new CategoryController(log, service);
}

// Film category
export function useFilmCategoryController(
  log: Log,
  db: DB,
  mapper?: TemplateMap
): CategoryController {
  const query = useQuery('filmcategory', mapper, categoryModel, true);
  const builder = new SearchBuilder<Category, CategoryFilter>(
    db.query,
    'filmcategory',
    categoryModel,
    db.driver,
    query
  );
  const repository = new  Repository<Category, string>(db, 'filmcategory', categoryModel);
  const service = new CategoryManager(builder.search, repository);
  return new CategoryController(log, service);
}

// Company category
export function useCompanyCategoryController(
  log: Log,
  db: DB,
  mapper?: TemplateMap
): CategoryController {
  const query = useQuery('companycategory', mapper, categoryModel, true);
  const builder = new SearchBuilder<Category, CategoryFilter>(
    db.query,
    'companycategory',
    categoryModel,
    db.driver,
    query
  );
  const repository = new  Repository<Category, string>(db, 'companycategory', categoryModel);
  const service = new CategoryManager(builder.search, repository);
  return new CategoryController(log, service);
}
