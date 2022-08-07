import { Controller, Log } from 'express-ext';
import { Job, JobFilter, JobService } from './job';

export class JobController extends Controller<Job, string, JobFilter> {
  constructor(log: Log, jobService: JobService) {
    super(log, jobService);
  }
}
