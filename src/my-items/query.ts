import { Statement } from "query-core";
import { ItemFilter } from "./item";

export function buildQuery(s: ItemFilter): Statement {
  let query = `select * from items`;
  const where = [];
  const params = [];
  let i = 1;

  if (s.id && s.id.length > 0) {
    where.push(`id = $${i++}`);
    params.push(s.id);
  }
  if (s.title && s.title.length > 0) {
    where.push(`title ilike $${i++}`);
    params.push("%" + s.title + "%");
  }
  if (s.status && s.status.length > 0) {
    where.push(`status ilike $${i++}`);
    params.push("%" + s.status + "%");
  }
  if (s.brand && s.brand.length > 0) {
    const brand = [];
    for (const b of s.brand) {
      brand.push(`brand = $${i++}`);
      params.push(b);
    }
    where.push(`(${brand.join(" or ")})`);
  }
  if (s.price) {
    if (s.price.min && s.price.max) {
      console.log(s.price.min)
      where.push(`price >= $${i++} and price <= $${i++}`);
      params.push(s.price.min);
      params.push(s.price.max);
    } else if (s.price.min) {
      where.push(`price >= $${i++}`);
      params.push(s.price.min);
    } else if (s.price.max) {
      where.push(`price <= $${i++}`);
      params.push(s.price.max);
    }
  }
  if (s.description && s.description.length > 0) {
    where.push(`description ilike $${i++}`);
    params.push("%" + s.description + "%");
  }
  if (s.categories && s.categories.length > 0) {
    params.push(s.categories);
    where.push(`categories && $${i++}`);
  }
  if (s.q && s.q.length > 0) {
    where.push(`(title ilike $${i++} or description ilike $${i++}) `);
    params.push("%" + s.q + "%");
    params.push("%" + s.q + "%");
  }
  if (where.length > 0) {
    query = query + `where` + where.join("and");
  }
  if (s.limit && s.limit > 0) {
    query = query + ` limit ${s.limit}`;
  }

  console.log(query, params)

  return { query, params };
}
