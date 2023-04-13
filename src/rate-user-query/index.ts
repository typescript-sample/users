export interface Info<ID> {
    id: ID;
    url: string;
    name: string;
}
export function param(i: number): string {
    return '$' + i;
}
// tslint:disable-next-line:max-classes-per-file
export class InfoQuery<ID> {
    constructor(protected queryF: <T>(sql: string, args?: any[]) => Promise<T[]>, protected table: string, url?: string, id?: string, name?: string, displayName?: string) {
        this.id = (id && id.length > 0 ? id : 'id');
        this.url = (url && url.length > 0 ? url : 'url');
        this.name = (name && name.length > 0 ? name : 'name');
        this.displayName = (displayName && displayName.length > 0 ? displayName : 'displayname');
        this.query = this.query.bind(this);
        this.load = this.load.bind(this);
    }
    protected id: string;
    protected url: string;
    protected name: string;
    protected displayName: string;
    // tslint:disable-next-line:array-type
    load(ids: ID[]): Promise<Info<ID>[]> {
        return this.query(ids);
    }
    // tslint:disable-next-line:array-type
    query(ids: ID[]): Promise<any[]> {
        if (!ids || ids.length === 0) {
            // tslint:disable-next-line:array-type
            const s: Info<ID>[] = [];
            return Promise.resolve(s);
        }
        const ps: any[] = [];
        const pv: string[] = [];
        const l = ids.length;
        for (let i = 1; i <= l; i++) {
            ps.push(ids[i - 1]);
            pv.push(param(i));
        }
        const sql = `select ${this.id} as id, ${this.url} as url, case when ${this.displayName} is not null then ${this.displayName} else ${this.name} end as name from ${this.table} where ${this.id} in (${pv.join(',')}) and ${this.url} is not null order by ${this.id}`;
        return this.queryF(sql, ps);
    }
}
// tslint:disable-next-line:array-type
export function useInfoQuery<ID>(queryF: <T>(sql: string, args?: any[]) => Promise<T[]>, table: string, url?: string, id?: string, name?: string, displayName?: string): ((ids: ID[]) => Promise<any[]>) {
    const q = new InfoQuery<ID>(queryF, table, url, id, name, displayName);
    return q.query;
}