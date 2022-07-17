import { DB, Repository } from 'query-core';
import { Item, itemModel, ItemRepository } from './item';

export class SqlItemRepository extends Repository<Item, string> implements ItemRepository {
  constructor(db: DB) {
    super(db, 'items', itemModel);
  }
}
