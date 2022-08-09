import { Log, QueryController } from 'express-ext';
import { Item, ItemFilter, ItemQuery } from './item';

export class ItemController extends QueryController<Item, string, ItemFilter> {
  constructor(log: Log, protected itemQuery: ItemQuery) {
    super(log, itemQuery);
  }
}
