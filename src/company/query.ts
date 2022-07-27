import { Statement } from 'query-core';
import { CompanyFilter } from './company';

export function buildQuery(s: CompanyFilter): Statement {
  let query = `select * from companies`;
  const where = [];
  const params = [];
  let i = 1;
  if (s.id && s.id.length > 0) {
    where.push(`id = $${i++}`);
    params.push(s.id);
  }
  if (s.name && s.name.length > 0) {
    where.push(`name ilike $${i++}`);
    params.push('%' + s.name + '%');
  }
  if (s.status && s.status.length > 0) {
    where.push(`status ilike $${i++}`);
    params.push("%" + s.status + "%");
  }
  if (s.description && s.description.length > 0) {
    where.push(`description ilike $${i++}`);
    params.push('%' + s.description + '%');
  }
  if (s.categories && s.categories.length > 0) {
    where.push(`categories && $${i++}`);
    params.push(s.categories);
  }
  if (s.size) {
    if (s.size.min && s.size.max) {
      where.push(`size >= $${i++} and size <= $${i++}`);
      params.push(s.size.min);
      params.push(s.size.max);
    } else if (s.size.min) {
      where.push(`size >= $${i++}`);
      params.push(s.size.min);
    } else if (s.size.max) {
      where.push(`size <= $${i++}`);
      params.push(s.size.max);
    }
  }
  if (where.length > 0) {
    query = query + ` where ` + where.join(' and ');
  }
  return { query, params };
}