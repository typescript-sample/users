import { params } from 'pg-extension';
import { DB, Repository } from 'query-core';
import { Item, itemModel, ItemRepository } from './item';

export class SqlItemRepository extends Repository<Item, string> implements ItemRepository {
  constructor(db: DB, table: string) {
    super(db, table, itemModel);
    this.getItems = this.getItems.bind(this);
  }
  getItems(ids: string[]): Promise<Item[]> {
    if (!ids || ids.length === 0) {
      return Promise.resolve([]);
    }
    const sql = `select * from ${this.table} where id in (${params(ids.length)})`;
    return this.query<Item>(sql, ids, this.map);
  }
}
