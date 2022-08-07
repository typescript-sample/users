import { DB, Repository } from 'query-core';
import { Category, categoryModel, CategoryRepository } from './category';

export class SqlCategoryRepositoy extends Repository<Category, string> implements CategoryRepository {
  constructor(db: DB, table: string) {
    super(db, table, categoryModel);
  }
}
