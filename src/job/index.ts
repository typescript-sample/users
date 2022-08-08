import { Log } from 'express-ext';
import { Manager, Search,ViewSearchManager } from 'onecore';
import { DB, SearchBuilder } from 'query-core';
import { TemplateMap, useQuery } from 'query-mappers';
import { Job, JobFilter, jobModel, JobRepository, JobQuery } from './job';
import { JobController } from './job-controller';
import { SqlJobRepositoy } from './job-responsitory';

export { JobController };

export class JobService extends ViewSearchManager<Job, string, JobFilter> implements JobQuery {
  constructor(search: Search<Job, JobFilter>, repository: JobRepository) {
    super(search, repository);
  }
}
export function useJobService(db: DB, mapper?: TemplateMap): JobQuery {
  const query = useQuery('jobs', mapper, jobModel, true);
  const builder = new SearchBuilder<Job, JobFilter>(db.query, 'jobs', jobModel, db.driver, query);
  const repository = new SqlJobRepositoy(db);
  return new JobService(builder.search, repository);

}
export function useJobController(log: Log, db: DB, mapper?: TemplateMap): JobController {
  return new JobController(log, useJobService(db, mapper));
}
