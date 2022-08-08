import { SavedController } from 'express-ext';
import { Log, SavedRepository, SavedService, Search, ViewSearchManager } from 'onecore';
import { ArrayRepository } from 'pg-extension';
import { DB, postgres, QueryRepository, Repository, SearchBuilder } from 'query-core';
import { Item, ItemFilter, itemModel, ItemQuery, ItemRepository, } from './item';
import { ItemController } from './item-controller';
import { buildQuery } from './query';

export * from './item';
export { ItemController };

export class ItemManager extends ViewSearchManager<Item, string, ItemFilter> implements ItemQuery {
  constructor(search: Search<Item, ItemFilter>, protected itemRepository: ItemRepository, protected saveItemsRepository: SavedRepository<string>, public max: number) {
    super(search, itemRepository);
  }
}
export function useItemController(log: Log, db: DB): ItemController {
  const savedItemMax = 50;
  const builder = new SearchBuilder<Item, ItemFilter>(db.query, 'items', itemModel, postgres, buildQuery);
  const repository = new Repository<Item, string>(db, 'items', itemModel);
  const saveItemRepository = new ArrayRepository<string, string>(db.query, db.exec, 'save_items', 'items', 'id');
  const service = new ItemManager(builder.search, repository, saveItemRepository, savedItemMax);
  return new ItemController(log, service);
}

export function useSavedController(log: Log, db: DB): SavedController<Item> {
  const savedRepository = new ArrayRepository<string, string>(db.query, db.exec, 'save_items', 'items', 'id');
  const repository = new QueryRepository<Item, string>(db, 'items', itemModel);
  const service = new SavedService(savedRepository, repository.query, 50);
  return new SavedController<Item>(log, service, 'itemId', 'id');
}
