import { QueryController, SavedController ,Log } from 'express-ext';
import {  SavedRepository, SavedService, Search, ViewSearchManager } from 'onecore';
import { ArrayRepository } from 'pg-extension';
import { DB, postgres, QueryRepository, Repository, SearchBuilder } from 'query-core';
import { Item, ItemFilter, itemModel, ItemQuery, ItemRepository, } from './item';
import { buildQuery } from './query';

export * from './item';

export class ItemManager extends ViewSearchManager<Item, string, ItemFilter> implements ItemQuery {
  constructor(search: Search<Item, ItemFilter>, protected itemRepository: ItemRepository, protected saveItemsRepository: SavedRepository<string>, public max: number) {
    super(search, itemRepository);
  }
}

export class ItemController extends QueryController<Item, string, ItemFilter> {
  constructor(log: Log, protected itemQuery: ItemQuery) {
    super(log, itemQuery);
  }
}
export function useItemController(log: Log, db: DB): ItemController {
  const savedItemMax = 50;
  const builder = new SearchBuilder<Item, ItemFilter>(db.query, 'item', itemModel, postgres, buildQuery);
  const repository = new Repository<Item, string>(db, 'item', itemModel);
  const saveItemRepository = new ArrayRepository<string, string>(db.query, db.exec, 'saveditem', 'items', 'id');
  const service = new ItemManager(builder.search, repository, saveItemRepository, savedItemMax);
  return new ItemController(log, service);
}

export function useSavedController(log: Log, db: DB): SavedController<Item> {
  const savedRepository = new ArrayRepository<string, string>(db.query, db.exec, 'saveditem', 'items', 'id');
  const repository = new QueryRepository<Item, string>(db, 'item', itemModel);
  const service = new SavedService<string, Item>(savedRepository, repository.query, 50);
  return new SavedController<Item>(log, service, 'itemId', 'id');
}
