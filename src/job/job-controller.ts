import { Controller, Log, ViewController } from 'express-ext';
import { Job, JobFilter, JobQuery} from './job';

export class JobController extends ViewController<Job, string, JobFilter> {
  constructor(log: Log, jobService: JobQuery) {
    super(log, jobService);
  }
}
