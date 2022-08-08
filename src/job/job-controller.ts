import { Controller, Log, QueryController } from 'express-ext';
import { Job, JobFilter, JobQuery} from './job';

export class JobController extends QueryController<Job, string, JobFilter> {
  constructor(log: Log, jobService: JobQuery) {
    super(log, jobService);
  }
}
