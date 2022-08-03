import {
  Attributes,
  DB,
  GenericRepository,
  Repository,
  Statement,
} from "query-core";
import {
  Response,
  ResponseId,
  ResponseRepository,
} from "./core-query";

export class SqlResponseRepository
  extends GenericRepository<Response, string, string>
  implements ResponseRepository
{
  constructor(
    db: DB,
    table: string,
    attributes: Attributes,
    protected buildToSave: <T>(
      obj: T,
      table: string,
      attrs: Attributes,
      ver?: string,
      buildParam?: (i: number) => string,
      i?: number
    ) => Statement | undefined
  ) {
    super(db, table, attributes, 'id', 'author');
    this.save = this.save.bind(this);
    this.load = this.load.bind(this);
  }
  
  save(obj: Response, ctx?: any): Promise<number> {
    const stmt = this.buildToSave(obj, this.table, this.attributes);
    if (stmt) {
      return this.exec(stmt.query, stmt.params, ctx);
    } else {
      return Promise.resolve(0);
    }
  }
}
