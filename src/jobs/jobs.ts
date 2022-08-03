import { Attributes, Filter, Service } from 'onecore';
import { Repository } from 'query-core';

export interface JobFilter extends Filter {
    id?: string;
    title?: string;
    description?: string;
    skill?:string[];
    publishedAt?:Date;
    expiredAt?:Date;
    quantity?:number;
    applicantCount?: number;
}
export interface Job {
  id: string;
  title: string;
  description: string;
  skill?:string[];
  publishedAt:Date;
  expiredAt:Date;
  quantity:number;
  applicantCount: number;
}
export interface JobRepository extends Repository<Job, string>{

}
export interface JobService extends Service<Job, string, JobFilter> {

}

export const jobModel: Attributes = {
  id: {
    length: 40,
  },
  title: {
    length:120
  },
  description: {
    length:1000
  },
  publishedAt: {
    type: 'datetime'
  },
  expiredAt: {
    type: 'datetime'
  },
  skill:{
    type:'primitives'
  },
  quantity: {
    type:'number'
  },
  applicantCount: {
    type:'number'
  },
};
