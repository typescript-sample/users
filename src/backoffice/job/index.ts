import { Controller, Log } from 'express-ext'
import { Manager,  Search } from 'onecore'
import { DB, Repository, SearchBuilder } from 'query-core'
import { TemplateMap, useQuery } from 'query-mappers'
import { Job, JobFilter, jobModel, JobRepository, JobService } from './job'

export class JobManager extends Manager<Job, string, JobFilter> implements JobService {
  constructor(search: Search<Job, JobFilter>, repository: JobRepository) {
    super(search, repository)
  } // End of constructor
} // End of JobManager

export class BackOfficeJobController extends Controller<Job, string, JobFilter> {
  constructor(log: Log, jobService: JobService) {
    super(log, jobService)
  } // End of constructor
} // End of BackOfficeJobController

export const useBackOfficeJobController = (log: Log, db: DB, mapper?: TemplateMap) => new BackOfficeJobController(
  log,
  new JobManager(
    new SearchBuilder<Job, JobFilter>(db.query, 'job', jobModel, db.driver, useQuery('job', mapper, jobModel, true)).search,
    new Repository<Job, string>(db, 'job', jobModel)
  )
) // End of useBackOfficeJobController