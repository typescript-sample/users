import { Attributes, Statement } from 'pg-extension';
import { buildToInsert, buildToUpdate, DB, Repository } from 'query-core';
import { Appreciation, AppreciationId, appreciationModel, AppreciationRepository, Reply } from './appreciation';

export class SqlAppreciationRepository extends Repository<Appreciation, AppreciationId> implements AppreciationRepository {
  constructor(db: DB, table: string, protected buildToSave: <T>(obj: T, table: string, attrs: Attributes, ver?: string, buildParam?: (i: number) => string, i?: number) => Statement | undefined) {
    super(db, table, appreciationModel);
    this.save = this.save.bind(this);
    this.getAppreciation = this.getAppreciation.bind(this);
    this.increaseReplyCount = this.increaseReplyCount.bind(this);
    this.decreaseReplyCount = this.decreaseReplyCount.bind(this);
  }

  save(obj: Appreciation, ctx?: any): Promise<number> {
    const stmt = this.buildToSave(obj, this.table, this.attributes);
    if (stmt) {
      console.log(stmt.query);
      return this.exec(stmt.query, stmt.params, ctx);
    } else {
      return Promise.resolve(0);
    }
  }

  insert(obj: Appreciation, ctx?: any): Promise<number> {
    obj.time=obj.updateAt=new Date
    const stmt = buildToInsert(obj, this.table, appreciationModel, this.param);
    if (!stmt) {
      return Promise.resolve(-1);
    }
    return this.exec(stmt.query,stmt.params);
  }
  
  update(obj: Appreciation, ctx?: any): Promise<number> {
    return this.getAppreciation(obj.id, obj.author).then((a: Appreciation | null) => {
      if (!a) { return Promise.resolve(-1); }
      obj.updateAt = new Date;
      const histories=a.histories?a.histories:[]
      histories.push( { review: a.review, time: a.time,title:a.title })
      obj.histories = histories
      const stmt = buildToUpdate(obj, 'appreciation', appreciationModel, this.param);
      if (!stmt) {
        return Promise.resolve(-1); 
      }
      return this.exec(stmt.query, stmt.params)
    })
  }
  getAppreciation(id: string, author: string, ctx?: any): Promise<Appreciation | null> {
    return this.query<Appreciation>(`select * from ${this.table} where id = ${this.param(1)} and author = ${this.param(2)}`, [id, author], this.map, undefined, ctx).then(appreciation => {
      return appreciation && appreciation.length > 0 ? appreciation[0] : null;
    });
  }
  increaseReplyCount(id: string, author: string, ctx?: any): Promise<number> {
    return this.exec(`update ${this.table} set replyCount = replyCount + 1 where id = ${this.param(1)} and author = ${this.param(2)}`, [id, author], ctx);
  }
  decreaseReplyCount(id: string, author: string, ctx?: any): Promise<number> {
    return this.exec(`update ${this.table} set replyCount = replyCount - 1 where id = ${this.param(1)} and author = ${this.param(2)}`, [id, author], ctx);
  }

  async delete(id: AppreciationId, ctx?: any): Promise<number> {
    try {
      const q = `delete from ${this.table} where id = ${this.param(1)} and author = ${this.param(2)}`;
      const q2 = `delete from reply where id = ${this.param(1)} and author = ${this.param(2)}`;
      const stmts: Statement[] = [
        { query: q, params: [id.id, id.author] }
      ];
      return this.execBatch(stmts, true).catch(err => {
        console.log('first', err)
        return 0
      });
    } catch (err) {
      console.log('err', err)
      return 0
    }

  }
}
