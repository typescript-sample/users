import { Log, Search, ViewSearchManager } from 'onecore';
import { buildToSave } from 'pg-extension';
import { DB, postgres, SearchBuilder } from 'query-core';
import { Item, ItemFilter, itemModel, ItemQuery, ItemRepository, SavedItemsRepository } from './item';
import { SaveItems, saveItemsModel } from './item';
import { ItemController } from './item-controller';
import { buildQuery } from './query';
import { SqlItemRepository } from './sql-item-repository';
import { SqlSaveItemsRepository } from './sql-item-repository';

export * from './item';
export { ItemController };

export class ItemManager extends ViewSearchManager<Item, string, ItemFilter> implements ItemQuery {
  constructor(search: Search<Item, ItemFilter>, protected itemRepository: ItemRepository, protected saveItemsRepository: SavedItemsRepository, public max: number) {
    super(search, itemRepository);
  }
  async saveItems(id: string, itemId: string): Promise<number> {
    const item = await this.saveItemsRepository.load(id);
    if (item) {
      item.items.push(itemId);
      if (item.items.length > this.max) {
        item.items.shift();
      }
      return this.saveItemsRepository.update(item);
    } else {
      const newItem: SaveItems = { id, items: [itemId] };
      return this.saveItemsRepository.insert(newItem);
    }
  }
  async getSavedItems(id: string): Promise<Item[]> {
    const saveItems = await this.saveItemsRepository.load(id);
    if (!saveItems || !saveItems.items || saveItems.items.length === 0) {
      return [];
    }
    return this.itemRepository.getItems(saveItems.items);
  }
}
export function useItemService(db: DB): ItemQuery {
  const savedItemMax = 50;
  const builder = new SearchBuilder<Item, ItemFilter>(db.query, 'items', itemModel, postgres, buildQuery);
  const repository = new SqlItemRepository(db, 'items');
  const saveItemRepository = new SqlSaveItemsRepository(db, 'save_items', saveItemsModel, buildToSave);
  return new ItemManager(builder.search, repository, saveItemRepository, savedItemMax);
}
export function useItemController(log: Log, db: DB): ItemController {
  return new ItemController(log, useItemService(db));
}
