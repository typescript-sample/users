import { params } from 'pg-extension';
import { Attributes, DB, Repository, Statement } from 'query-core';
import { Item, itemModel, ItemRepository } from './item';
import { SavedItemsRepository } from './item';

export class SqlItemRepository extends Repository<Item, string> implements ItemRepository {
  constructor(db: DB, table: string) {
    super(db, table, itemModel);
  }
  getItems(ids: string[]): Promise<Item[]> {
    if (!ids || ids.length === 0) {
      return Promise.resolve([]);
    }
    const sql = `select * from ${this.table} where id in (${params(ids.length)})`;
    return this.query<Item>(sql, ids, this.map);
  }
}

export class SqlSaveItemsRepository extends Repository<any, string> implements SavedItemsRepository {
  constructor(db: DB, table: string, attributes: Attributes, protected buildToSave: <T>(obj: T, table: string, attrs: Attributes, ver?: string, buildParam?: (i: number) => string, i?: number) => Statement|undefined) {
    super(db, table, attributes);
  }
  save(obj: any): Promise<number> {
    const stmt = this.buildToSave(obj, this.table, this.attributes);
    if (stmt) {
      return this.exec(stmt.query, stmt.params);
    } else {
      return Promise.resolve(-1);
    }
  }
}
