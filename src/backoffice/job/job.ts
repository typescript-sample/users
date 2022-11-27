import { Attributes, Filter, Repository, Service } from 'onecore'

export interface Job {
  id: string
  title: string
  description: string
  skill?: string[]
  publishedAt: Date
  expiredAt: Date
  quantity: number
  applicantCount: number
  requirements: string
  benefit: string
  companyId: string
} // End of Job

export interface JobFilter extends Filter {
  id?: string
  title?: string
  description?: string
  skill?: string[]
  publishedAt?: Date
  expiredAt?: Date
  quantity?: number
  applicantCount?: number
  requirements?: string
  benefit?: string
} // End of JobFilter

export interface JobRepository extends Repository<Job, string> {
} // End of JobRepository

export interface JobService extends Service<Job, string, JobFilter> {
} // End of JobService

export const jobModel: Attributes = {
  id: {
    key: true,
    length: 40
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
  companyId: {
    type: 'string',
    column: 'company_id'
  }
} // End of jobModel