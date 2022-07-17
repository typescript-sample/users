import { Log, Manager, Search } from 'onecore';
import { DB, postgres, SearchBuilder } from 'query-core';
import { TemplateMap, useQuery } from 'query-mappers';
import { Item, ItemFilter, itemModel, ItemRepository, ItemService } from './item';
import { MyItemController } from './item-controller';
import {buildQuery} from './query';
export * from './item';
export { MyItemController };

import { SqlItemRepository } from './sql-item-repository';

export class ItemManager extends Manager<Item, string, ItemFilter> implements ItemService {
  constructor(search: Search<Item, ItemFilter>, repository: ItemRepository) {
    super(search, repository);
  }
}

export function useItemService(db: DB, mapper?: TemplateMap): ItemService {
  const queryItems = useQuery('item', mapper, itemModel, true);
  const builder = new SearchBuilder<Item, ItemFilter>(db.query, 'items', itemModel, postgres, queryItems);
  const repository = new SqlItemRepository(db);
  return new ItemManager(builder.search, repository);
}
export function useItemController(log: Log, db: DB, mapper?: TemplateMap): MyItemController {
  return new MyItemController(log, useItemService(db, mapper));
}
