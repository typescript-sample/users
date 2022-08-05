import { DB, Repository } from "query-core";
import { Job, jobModel, JobRepository } from "./jobs";

export class SqlJobRepositoy extends Repository<Job, string> implements JobRepository{
  constructor(db:DB){
    super(db, 'jobs', jobModel);
  }
}