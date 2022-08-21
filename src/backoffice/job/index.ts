import { Controller, Log } from 'express-ext';
import { Manager,  Search } from 'onecore';
import { DB, Repository, SearchBuilder } from 'query-core';
import { TemplateMap, useQuery } from 'query-mappers';
import { Job, JobFilter, jobModel, JobRepository, JobService } from './job';

export class JobManager extends Manager<Job, string, JobFilter> implements JobService {
  constructor(search: Search<Job, JobFilter>, repository: JobRepository) {
    super(search, repository);
  }
}

export class BackOfficeJobController extends Controller<Job, string, JobFilter> {
  constructor(log: Log, jobService: JobService) {
    super(log, jobService);
  }
}
export function useBackOfficeJobController(log: Log, db: DB, mapper?: TemplateMap): BackOfficeJobController {
  const query = useQuery('job', mapper, jobModel, true);
  const builder = new SearchBuilder<Job, JobFilter>(db.query, 'job', jobModel, db.driver, query);
  const repository = new Repository<Job, string>(db, 'job', jobModel);
  const service = new JobManager(builder.search, repository);
  return new BackOfficeJobController(log, service);
}
