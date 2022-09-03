import { Attributes, Filter, Repository, Service } from 'onecore';

export interface JobFilter extends Filter {
  id?: string;
  title?: string;
  description?: string;
  skill?: string[];
  publishedAt?: Date;
  expiredAt?: Date;
  quantity?: number;
  applicantCount?: number;
  requirements?: string;
  benefit?: string;
}
export interface Job {
  id: string;
  title: string;
  description: string;
  skill?: string[];
  publishedAt: Date;
  expiredAt: Date;
  quantity: number;
  applicantCount: number;
  requirements: string;
  benefit: string;
}
export interface JobRepository extends Repository<Job, string> {
}
export interface JobService extends Service<Job, string, JobFilter> {
}

export const jobModel: Attributes = {
  id: {
    key: true,
    length: 40,
  },
  title: {
    length: 120
  },
  description: {
    length: 1000
  },
  publishedAt: {
    type: 'datetime'
  },
  expiredAt: {
    type: 'datetime'
  },
  skill: {
    type: 'primitives'
  },
  quantity: {
    type: 'number'
  },
  applicantCount: {
    type: 'number'
  },
};
