import { Request, Response } from 'express';
import { Log, ViewController } from 'express-ext';
import { Item, ItemFilter } from './item';
import { ItemQuery } from './item';

export class ItemController extends ViewController<Item, string, ItemFilter> {
  constructor(log: Log, protected itemQuery: ItemQuery) {
    super(log, itemQuery);
  }
}

export interface SavedService<T> {
  load(id: string): Promise<T[]>;
  save(id: string, itemId: string): Promise<number>;
}
export class SavedController<T> {
  constructor(public log: Log, public service: SavedService<T>, public item: string, id?: string) {
    this.id = (id && id.length > 0 ? id : 'id');
    this.save = this.save.bind(this);
    this.load = this.load.bind(this);
  }
  id: string;
  save(req: Request, res: Response) {
    const id = req.params[this.id];
    const itemId = req.params[this.item];
    this.service.save(id, itemId).then(data => {
     return res.status(200).json(data).end();
    })
    .catch(err => console.log(err));
  }
  load(req: Request, res: Response) {
    console.log('endter load')
    const id = req.params[this.id];
    this.service.load(id).then(data => {
      console.log(' get data ' + JSON.stringify(data))
     return res.status(200).json(data).end();
    })
    .catch(err => console.log(err));
  }
}
