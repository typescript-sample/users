export interface SavedRepository<ID> {
    load(id: ID): Promise<string[]|null>;
    insert(id: ID, arr: string[]): Promise<number>;
    update(id: ID, arr: string[]): Promise<number>;
  }
  // tslint:disable-next-line:max-classes-per-file
  export class SavedService<ID, T> {
    constructor(protected repository: SavedRepository<ID>, protected query: (ids: string[]) => Promise<T[]>, public max: number) {
      this.load = this.load.bind(this);
      this.save = this.save.bind(this);
      this.remove = this.remove.bind(this);
    }
    load(id: ID): Promise<T[]> {
      return this.repository.load(id).then(items => {
        if (!items || items.length === 0) {
          return [];
        }
        return this.query(items);
      });
    }
    save(id: ID, itemId: string): Promise<number> {
      return this.repository.load(id).then(items => {
        if (items == null) {
          return this.repository.insert(id, [itemId]);
        } else {
          if (items.includes(itemId)) {
            return Promise.resolve(0);
          } else {
            items.push(itemId);
            if (items.length > this.max) {
              items.shift();
            }
            return this.repository.update(id, items);
          }
        }
      });
    }
    remove(id: ID, itemId: string): Promise<number> {
      return this.repository.load(id).then(items => {
        if (items == null) {
          return Promise.resolve(0);
        } else {
          if (items.includes(itemId)) {
            items=items.filter((item:any)=>{
              return item!==itemId
            })
            return this.repository.update(id, items);
          }else{
            return Promise.resolve(0);
          }
        }
      });
    }
  }