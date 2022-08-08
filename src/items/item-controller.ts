import { Request, Response } from 'express';
import { Log, ViewController } from 'express-ext';
import { Item, ItemFilter } from './item';
import { ItemQuery } from './item';

export class ItemController extends ViewController<Item, string, ItemFilter> {
  constructor(log: Log, protected itemQuery: ItemQuery) {
    super(log, itemQuery);
    this.array = ['status'];
    this.savedItems = this.savedItems.bind(this);
    this.getSavedItems = this.getSavedItems.bind(this);
  }
  savedItems(req: Request, res: Response) {
    const id = req.params['id'];
    const itemId = req.params['itemId'];
    this.itemQuery.saveItems(id, itemId).then(data => {
      return res.status(200).json(data).send();
    })
    .catch(err => console.log(err));
  }
  getSavedItems(req: Request, res: Response) {
    const id = req.params['id'];
    this.itemQuery.getSavedItems(id).then(data => {
      return res.status(200).json(data).send();
    })
    .catch(err => console.log(err));
  }
}
