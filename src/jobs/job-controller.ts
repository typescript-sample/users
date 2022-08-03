import { Controller, Log } from 'express-ext';
import { Job, JobFilter, JobService } from './jobs';

export class JobController extends Controller<Job, string, JobFilter> {
  constructor(log: Log, jobService: JobService) {
    super(log, jobService);
  }
}