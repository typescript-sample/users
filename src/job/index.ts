import { Log } from 'express-ext';
import {Search,ViewSearchManager } from 'onecore';
import { DB, Repository, SearchBuilder } from 'query-core';
import { TemplateMap, useQuery } from 'query-mappers';
import { Job, JobFilter, jobModel, JobRepository, JobQuery } from './job';
import { JobController } from './job-controller';

export { JobController };

export class JobService extends ViewSearchManager<Job, string, JobFilter> implements JobQuery {
  constructor(search: Search<Job, JobFilter>, repository: JobRepository) {
    super(search, repository);
  }
}
export function useJobController(log: Log, db: DB, mapper?: TemplateMap): JobController {
  const query = useQuery('job', mapper, jobModel, true);
  const builder = new SearchBuilder<Job, JobFilter>(db.query, 'job', jobModel, db.driver, query);
  const repository = new Repository<Job, string>(db, 'job', jobModel);
  const service= new JobService(builder.search, repository)
  return new JobController(log,service);
}
