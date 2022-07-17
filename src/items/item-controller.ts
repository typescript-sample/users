import { Log, ViewController } from 'express-ext';
import { Item, ItemFilter, ItemQuery } from './item';

export class ItemController extends ViewController<Item, string, ItemFilter> {
  constructor(log: Log, itemQuery: ItemQuery) {
    super(log, itemQuery);
    this.array = ['status'];
  }
}
