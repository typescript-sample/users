
import { Log } from "express-ext";
import { Manager, Mapper, Search } from "onecore";
import { DB, SearchBuilder } from "query-core";
import { TemplateMap, useQuery } from "query-mappers";
import { Job, JobFilter, jobModel, JobRepository, JobService } from "./jobs";
import { JobController } from "./job-controller";
import { SqlJobRepositoy } from "./job-responsitory";

export { JobController };

export class JobManager extends Manager<Job, string, JobFilter> implements JobService{
  constructor(search: Search<Job, JobFilter>, repository: JobRepository) {
    super(search, repository);
  }
}
export function useJobService(db: DB, mapper?: TemplateMap): JobService {
  const query = useQuery('jobs', mapper, jobModel, true);
  const builder = new SearchBuilder<Job, JobFilter>(db.query, 'jobs', jobModel, db.driver,query);
  const repository = new SqlJobRepositoy(db);
  return new JobManager(builder.search, repository);
  
}
export function useJobController(log: Log, db: DB, mapper?: TemplateMap): JobController {
  return new JobController(log, useJobService(db, mapper));
}