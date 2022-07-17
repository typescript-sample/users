import { Statement } from 'query-core';
import { UserFilter } from './user';

export function buildQuery(s: UserFilter): Statement {
  let query = `select * from users`;
  const where = [];
  const params = [];
  let i = 1;
  if (s.interests && s.interests.length > 0) {
    params.push(s.interests);
    where.push(`interests && $${i++}`);
  }
  if (s.skills && s.skills.length > 0) {
    const skills = [];
    for (const skill of s.skills) {
      skills.push(`$${i++} <@ ANY(skills)`);
      params.push(skill);
    }
    where.push(`(${skills.join(' or ')})`);
  }
  if (s.dateOfBirth) {
    if (s.dateOfBirth.min) {
      where.push(`date_of_birth >= $${i++}`);
      params.push(s.dateOfBirth.min);
    }
    if (s.dateOfBirth.max) {
      where.push(`date_of_birth <= $${i++}`);
      params.push(s.dateOfBirth.max);
    }
  }
  if (s.id && s.id.length > 0) {
    where.push(`id = $${i++}`);
    params.push(s.id);
  }
  if (s.username && s.username.length > 0) {
    where.push(`username ilike $${i++}`);
    params.push('%' + s.username + '%');
  }
  if (s.email && s.email.length > 0) {
    where.push(`email ilike $${i++}`);
    params.push(s.email + '%');
  }
  if (s.phone && s.phone.length > 0) {
    where.push(`username ilike $${i++}`);
    params.push('%' + s.phone + '%');
  }
  /*
  if (s.settings) {
    params.push(s.settings);
    where.push(`settings @> $${i++}`);
  }
  if (s.achievements && s.achievements.length > 0) {
    const achievements = [];
    for (const achievement of s.achievements) {
      achievements.push(`$${i++} <@ ANY(achievements)`);
      params.push(achievement);
    }
    where.push(`(${achievements.join(' or ')})`);
  }
  */
  if (where.length > 0) {
    query = query + ` where ` + where.join(' and ');
  }
  if (s.limit && s.limit > 0) {
    query = query + ` limit ${s.limit}`;
  }
  console.log(query);
  return { query, params };
}
// CREATE INDEX interests_index ON users (interests);
// db.Query(`select interests from users where interests && $1 and skills && $2`, [ 'Basketball', 'Kapp' ])
