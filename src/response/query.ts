import { Statement } from './core';
import { ResponseFilter } from './response';

export function buildQuery(s: ResponseFilter): Statement {
  let query = `select * from item_response`;
  const where = [];
  const params = [];
  let i = 1;

  if (s.id && s.id.length > 0) {
    where.push(`id = $${i++}`);
    params.push(s.id);
  }
  if (s.author && s.author.length > 0) {
    where.push(`author = $${i++}`);
    params.push(s.author);
  }
  if (s.time && s.time) {
    where.push(`time = $${i++}`);
    params.push(s.time);
  }
  if (s.description && s.description) {
    where.push(`description ilike $${i++}`);
    params.push('%' + s.description + '%');
  }
  if (s.usefulCount && s.usefulCount) {
    where.push(`usefulCount >= $${i++}`);
    params.push(s.usefulCount);
  }
  if (where.length > 0) {
    query = query + ` where ` + where.join('and');
  }
  if (s.limit && s.limit > 0) {
    query = query + ` limit ${s.limit}`;
  }
  return { query, params };
}
