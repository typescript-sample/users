import {
  Attributes,
  DB,
  Repository,
  Statement,
} from "query-core";
import {
  Response,
  ResponseId,
  ResponseRepository,
} from "./core-query";

export class SqlResponseRepository
  extends Repository<Response, ResponseId>
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
    super(db, table, attributes);
    this.save = this.save.bind(this);
    this.getResponse = this.getResponse.bind(this);
  }
  
  save(obj: Response, ctx?: any): Promise<number> {
    const stmt = this.buildToSave(obj, this.table, this.attributes);
    if (stmt) {
      return this.exec(stmt.query, stmt.params, ctx);
    } else {
      return Promise.resolve(0);
    }
  }
  getResponse(id: string, author: string, ctx?: any): Promise<Response | null> {
    return this.query<Response>(
      `select * from ${this.table} where id = ${this.param(
        1
      )} and author = ${this.param(2)}`,
      [id, author],
      this.map,
      undefined,
      ctx
    ).then((responses) => {
      return responses && responses.length > 0 ? responses[0] : null;
    });
  }
}
