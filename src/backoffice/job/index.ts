
import { Log } from 'express-ext';
import { Manager,  Search } from 'onecore';
import { DB, SearchBuilder } from 'query-core';
import { TemplateMap, useQuery } from 'query-mappers';
import { Job, JobFilter, jobModel, JobRepository, JobService } from './job';
import { BackOfficeJobController } from './job-controller';
import { SqlJobRepositoy } from './job-responsitory';

export { BackOfficeJobController };

export class JobManager extends Manager<Job, string, JobFilter> implements JobService {
  constructor(search: Search<Job, JobFilter>, repository: JobRepository) {
    super(search, repository);
  }
}
export function useBackOfficeJobService(db: DB, mapper?: TemplateMap): JobService {
  const query = useQuery('job', mapper, jobModel, true);
  const builder = new SearchBuilder<Job, JobFilter>(db.query, 'job', jobModel, db.driver, query);
  const repository = new SqlJobRepositoy(db);
  return new JobManager(builder.search, repository);
}
export function useBackOfficeJobController(log: Log, db: DB, mapper?: TemplateMap): BackOfficeJobController {
  return new BackOfficeJobController(log, useBackOfficeJobService(db, mapper));
}
