import { Log } from 'express-ext';
import {  QueryController } from 'express-ext';
import {Search, ViewSearchManager } from 'onecore';
import { DB, Repository, SearchBuilder } from 'query-core';
import { TemplateMap, useQuery } from 'query-mappers';
import { Job, JobFilter, jobModel, JobQuery, JobRepository } from './job';

export class JobService extends ViewSearchManager<Job, string, JobFilter> implements JobQuery {
  constructor(search: Search<Job, JobFilter>, repository: JobRepository) {
    super(search, repository);
  }
}

export class JobController extends QueryController<Job, string, JobFilter> {
  constructor(log: Log, jobService: JobQuery) {
    super(log, jobService);
  }
}
export function useJobController(log: Log, db: DB, mapper?: TemplateMap): JobController {
  const query = useQuery('job', mapper, jobModel, true);
  const builder = new SearchBuilder<Job, JobFilter>(db.query, 'job', jobModel, db.driver, query);
  const repository = new Repository<Job, string>(db, 'job', jobModel);
  const service = new JobService(builder.search, repository);
  return new JobController(log, service);
}
