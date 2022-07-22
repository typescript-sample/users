import { Statement } from 'query-core';
import { CompanyFilter } from './company';

export function buildQuery(s: CompanyFilter): Statement {
  let query = `select * from companys`;
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
  if (s.description && s.description.length > 0) {
    where.push(`description ilike $${i++}`);
    params.push('%' + s.description + '%');
  }
  if (s.catagories && s.catagories.length > 0) {
    where.push(`catagories && $${i++}`);
    params.push(s.catagories);
  }
  if (where.length > 0) {
    query = query + ` where ` + where.join(' and ');
  }
  return { query, params };
}