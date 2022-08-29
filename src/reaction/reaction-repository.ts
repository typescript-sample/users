import { Statement } from "pg-extension";
import { DB } from "query-core";
import { Reaction } from "./reaction";

export class ReactionService<ID> {
  constructor(
    public db: DB,
    public userreactionTable: string,
    public id: string,
    public author: string,
    public reaction: string,
    public prefix: string,
    public suffix: string,
    public userinfoTable: string,
    public infoId: string,
    public reactioncount: string,
    ) {
    this.react = this.react.bind(this);
    this.unreact = this.unreact.bind(this);
    this.checkReaction = this.checkReaction.bind(this);
  }
  react(id: ID, author: ID, reaction: string): Promise<number> {
    const query = `select reaction from ${this.userreactionTable} where ${this.id} = $1 and ${this.author} = $2`;
    return this.db.query<Reaction>(query, [id, author]).then(r => {
      if (r.length <= 0) {
        const obj: any = {
          l1: '0',
          l2: '0',
          l3: '0',
        };
        obj['l' + reaction] = '1';
        const query1 = `insert into ${this.userreactionTable}(${this.id},${this.author},${this.reaction}) values ($1, $2, $3)`;
        const query2 = `insert into ${this.userinfoTable}(${this.infoId},${this.prefix}1${this.suffix},${this.prefix}2${this.suffix},${this.prefix}3${this.suffix},${this.reactioncount}) values ($1, ${obj['l1']}, ${obj['l2']},${obj['l3']},1)
          on conflict (${this.id}) do update set ${this.prefix}1${this.suffix} = ${obj['l1']}, ${this.prefix}2${this.suffix} = ${obj['l2']}, ${this.prefix}3${this.suffix} = ${obj['l3']}, ${this.reactioncount}=1`;
        const s1: Statement = {query: query1, params: [id, author, reaction]};
        const s2: Statement = {query: query2, params: [id]};
        return this.db.execBatch([s1, s2]).catch(err=>{
          return Promise.resolve(0)
        });
      } else {
        const query1 = `update ${this.userreactionTable} set ${this.reaction} = $1 where ${this.id} = $2 and ${this.author} = $3`;
        const query2 =
          `update ${this.userinfoTable} set ${this.prefix}${r[0].reaction}${this.suffix} = ${this.prefix}${r[0].reaction}${this.suffix} - 1, ${this.prefix}${reaction}${this.suffix} = ${this.prefix}${reaction}${this.suffix} + 1
           where ${this.infoId} = $1`;
        const s1: Statement = {query: query1, params: [reaction, id, author]};
        const s2: Statement = {query: query2, params: [id]};
        console.log(query1,query2)
        return this.db.execBatch([s1, s2]).catch(err=>{
          return Promise.resolve(0)
        });
      }
    });
  }
  unreact(id: ID, author: ID, reaction: string): Promise<number> {
    const query1 = `delete from ${this.userreactionTable} where ${this.id} = $1 and ${this.author} = $2 and ${this.reaction} = $3`;
    const query2 =
          `update ${this.userinfoTable} set ${this.prefix}${reaction}${this.suffix} = ${this.prefix}${reaction}${this.suffix} - 1, ${this.reactioncount} = ${this.reactioncount} - 1
           where ${this.infoId} = $1`;
    const s1: Statement = {query: query1, params: [id, author, reaction]};
    const s2: Statement = {query: query2, params: [id]};
    console.log(query1,query2)
    return this.db.execBatch([s1, s2], true).catch(err=>{
      return Promise.resolve(0)
    });
  }
  checkReaction(id: ID, author: ID):Promise<any> {
    const query = `select reaction from ${this.userreactionTable} where ${this.id} = $1 and ${this.author} = $2`;
    return this.db.query<Reaction>(query, [id, author]).then(r=>{
      console.log(r)
      return r
    }).catch(err=>{
      return Promise.resolve(0)
    })
  }
}
