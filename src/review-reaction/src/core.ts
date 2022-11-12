export interface StringMap {
  [key: string]: string;
}
export interface Statement {
  query: string;
  params?: any[];
}
export interface DB {
  driver: string;
  param(i: number): string;
  exec(sql: string, args?: any[], ctx?: any): Promise<number>;
  execBatch(statements: Statement[], firstSuccess?: boolean, ctx?: any): Promise<number>;
  query<T>(sql: string, args?: any[], m?: StringMap, bools?: Attribute[], ctx?: any): Promise<T[]>;
}
export type DataType = 'ObjectId' | 'date' | 'datetime' | 'time'
  | 'boolean' | 'number' | 'integer' | 'string' | 'text'
  | 'object' | 'array' | 'binary'
  | 'primitives' | 'booleans' | 'numbers' | 'integers' | 'strings' | 'dates' | 'datetimes' | 'times';
export type FormatType = 'currency' | 'percentage' | 'email' | 'url' | 'phone' | 'fax' | 'ipv4' | 'ipv6';
export type MatchType = 'equal' | 'prefix' | 'contain' | 'max' | 'min'; // contain: default for string, min: default for Date, number

export interface Attribute {
  name?: string;
  field?: string;
  column?: string;
  type?: DataType;
  format?: FormatType;
  required?: boolean;
  match?: MatchType;
  default?: string|number|Date|boolean;
  key?: boolean;
  unique?: boolean;
  enum?: string[] | number[];
  q?: boolean;
  noinsert?: boolean;
  noupdate?: boolean;
  nopatch?: boolean;
  version?: boolean;
  length?: number;
  min?: number;
  max?: number;
  gt?: number;
  lt?: number;
  precision?: number;
  scale?: number;
  exp?: RegExp | string;
  code?: string;
  noformat?: boolean;
  ignored?: boolean;
  jsonField?: string;
  link?: string;
  typeof?: Attributes;
  true?: string|number;
  false?: string|number;
}
export interface Attributes {
  [key: string]: Attribute;
}

export interface Filter {
  page?: number;
  limit?: number;
  firstLimit?: number;
  fields?: string[];
  sort?: string;
  currentUserId?: string;

  q?: string;
  keyword?: string;
  excluding?: string[]|number[];
  refId?: string|number;

  pageIndex?: number;
  pageSize?: number;
}
export interface ViewRepository<T, ID> {
  load(id: ID, ctx?: any): Promise<T|null>;
}
export interface Repository<T, ID> extends ViewRepository<T, ID> {
  insert(obj: T, ctx?: any): Promise<number>;
  update(obj: T, ctx?: any): Promise<number>;
  delete(id: ID, ctx?: any): Promise<number>;
}

export interface ViewService<T, ID> {
  metadata?(): Attributes|undefined;
  keys?(): string[];
  all?(ctx?: any): Promise<T[]>;
  load(id: ID, ctx?: any): Promise<T|null>;
  exist?(id: ID, ctx?: any): Promise<boolean>;
}
export interface GenericService<T, ID, R> extends ViewService<T, ID> {
  insert(obj: T, ctx?: any): Promise<R>;
  update(obj: T, ctx?: any): Promise<R>;
  patch?(obj: T, ctx?: any): Promise<R>;
  save?(obj: T, ctx?: any): Promise<R>;
  delete?(id: ID, ctx?: any): Promise<number>;
}
export interface SearchResult<T> {
  list: T[];
  total?: number;
  last?: boolean;
  nextPageToken?: string;
}

export interface ErrorMessage {
  field: string;
  code: string;
  param?: string|number|Date;
  message?: string;
}
export interface ResultInfo<T> {
  status: number|string;
  errors?: ErrorMessage[];
  value?: T;
  message?: string;
}
export type Result<T> = number | ResultInfo<T>;
export interface SearchService<T, F extends Filter> {
  keys?(): string[];
  search(s: F, limit?: number, offset?: number|string, fields?: string[], ctx?: any): Promise<SearchResult<T>>;
}
export interface GenericSearchService<T, ID, R, F extends Filter>
  extends GenericService<T, ID, R>, SearchService<T, F> {
}
export interface Service<T, ID, F extends Filter> extends GenericSearchService<T, ID, Result<T>, F> {

}
export type Search<T, F> = (s: F, limit?: number, offset?: number | string, fields?: string[]) => Promise<SearchResult<T>>;
