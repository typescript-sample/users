import { DB, Log, Manager, Search } from 'onecore';
import { postgres, SearchBuilder, Query } from 'query-core';
import { TemplateMap, useQuery } from 'query-mappers';
import { Item, ItemFilter, itemModel, ItemRepository, ItemService } from './item';
import { buildQuery } from './query';
import { MyItemController } from './item-controller';
export * from './item';
export { MyItemController };

import { SqlItemRepository } from './sql-item-repository';

export class ItemManager extends Manager<Item, string, ItemFilter> implements ItemService {
  constructor(search: Search<Item, ItemFilter>, repository: ItemRepository, protected save: (values: string[]) => Promise<number>) {
    super(search, repository);
  }
  insert(item: Item, ctx?: any): Promise<number> {
    if (item.brand && item.brand.length > 0) {
      this.save([item.brand]);
    }
    return this.repository.insert(item, ctx);
  }
  update(item: Item, ctx?: any): Promise<number> {
    if (item.brand && item.brand.length > 0) {
      this.save([item.brand]);
    }
    return this.repository.update(item, ctx);
  }
  patch(item: Partial<Item>, ctx?: any): Promise<number> {
    if (item.brand && item.brand.length > 0) {
      this.save([item.brand]);
    }
    return (this.repository.patch ? this.repository.patch(item, ctx) : Promise.resolve(-1));
  }
}

export function useMyItemService(db: DB, save: (values: string[]) => Promise<number>, mapper?: TemplateMap): ItemService {
  const queryItems = useQuery('items', mapper, itemModel, true);
  const builder = new SearchBuilder<Item, ItemFilter>(db.query, 'items', itemModel, postgres, queryItems);
  const repository = new SqlItemRepository(db);
  return new ItemManager(builder.search, repository, save);
}
export function useMyItemController(log: Log, db: DB, save: (values: string[]) => Promise<number>, mapper?: TemplateMap): MyItemController {
  return new MyItemController(log, useMyItemService(db, save, mapper));
}
