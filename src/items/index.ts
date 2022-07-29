import { Log, Manager, Search } from 'onecore';
import { DB, postgres, Query, SearchBuilder } from 'query-core';
import { Item, ItemFilter, itemModel, ItemRepository, ItemService } from './item';
import { ItemController } from './item-controller';
import { buildQuery } from './query';
export * from './item';

export { ItemController };

import { SqlItemRepository } from './sql-item-repository';

export class ItemManager extends Manager<Item, string, ItemFilter> implements ItemService {
  constructor(search: Search<Item, ItemFilter>, repository: ItemRepository) {
    super(search, repository);
  }
}
export function useItemService(db: DB): ItemService {
  const builder = new SearchBuilder<Item, ItemFilter>(db.query, 'items', itemModel, postgres, buildQuery);
  const repository = new SqlItemRepository(db, 'items');
  return new ItemManager(builder.search, repository);
}
export function useItemController(log: Log, db: DB): ItemController {
  const query = new Query<Item, string, ItemFilter>(db.query, 'items', itemModel, postgres, buildQuery);
  return new ItemController(log, query);
}
