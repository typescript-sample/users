import { Log, SavedService, Search, ViewSearchManager } from 'onecore';
import { ArrayRepository } from 'pg-extension';
import { DB, postgres, SearchBuilder } from 'query-core';
import { Item, ItemFilter, itemModel, ItemQuery, ItemRepository, SavedItemsRepository } from './item';
import { ItemController, SavedController } from './item-controller';
import { buildQuery } from './query';
import { SqlItemRepository } from './sql-item-repository';

export * from './item';
export { ItemController };
export { SavedController };

export class ItemManager extends ViewSearchManager<Item, string, ItemFilter> implements ItemQuery {
  constructor(search: Search<Item, ItemFilter>, protected itemRepository: ItemRepository, protected saveItemsRepository: SavedItemsRepository, public max: number) {
    super(search, itemRepository);
  }
  async saveItems(id: string, itemId: string): Promise<number> {
    const items = await this.saveItemsRepository.load(id);
    if (items == null) {
      return this.saveItemsRepository.insert(id, [itemId]);
    } else {
      if (items.includes(itemId)) {
        return Promise.resolve(0);
      } else {
        items.push(itemId);
        if (items.length > this.max) {
          items.shift();
        }
        return this.saveItemsRepository.update(id, items);
      }
    }
  }
  async getSavedItems(id: string): Promise<Item[]> {
    const items = await this.saveItemsRepository.load(id);
    if (!items || items.length === 0) {
      return [];
    }
    return this.itemRepository.getItems(items);
  }
}
export function useItemController(log: Log, db: DB): ItemController {
  const savedItemMax = 50;
  const builder = new SearchBuilder<Item, ItemFilter>(db.query, 'items', itemModel, postgres, buildQuery);
  const repository = new SqlItemRepository(db, 'items');
  const saveItemRepository = new ArrayRepository<string, string>(db.query, db.exec, 'save_items', 'items', 'id');
  const service = new ItemManager(builder.search, repository, saveItemRepository, savedItemMax);
  return new ItemController(log, service);
}
export function useSavedController(log: Log, db: DB): SavedController<Item> {
  const savedRepository = new ArrayRepository<string, string>(db.query, db.exec, 'save_items', 'items', 'id');
  const repository = new SqlItemRepository(db, 'items');
  const service = new SavedService(savedRepository, repository.getItems, 50);
  return new SavedController<Item>(log, service, 'itemId', 'id');
}
