import { UploadInfo, uploadModel } from 'one-storage'
import { Attributes, Filter, NumberRange, Repository, Service } from 'onecore'
import { User } from '../../user'

export interface Company {
  id: string
  name: string
  description: string
  address: string
  size: number
  status: string
  establishedAt: Date
  categories: string[]
  imageURL?: string
  coverURL?: string
  gallery?: UploadInfo[]
  users?: User[]
}

export interface CompanyUser {
  companyId: string
  userId: string
}

export interface CompanyFilter extends Filter {
  id?: string
  name?: string
  description?: string
  address?: string
  size?: NumberRange
  status?: string
  establishedAt?: Date
  categories?: string[]
}

export interface CompanyRepository extends Repository<Company, string> {
  assignUsers(companyUsers: CompanyUser[]): Promise<number>
  deassignUsers(companyId: string, userIds: string[]): Promise<number>
}

export interface CompanyService extends Service<Company, string, CompanyFilter> {
  assignUsers(companyUsers: CompanyUser[]): Promise<number>
  deassignUsers(companyId: string, userIds: string[]): Promise<number>
}

export const companyModel: Attributes = {
  id: {
    key: true,
    match: 'equal',
  },
  name: {
    length: 120,
  },
  description: {
    length: 1000,
  },
  size: {
    type: 'number',
  },
  address: {
    length: 255,
  },
  status: {
    match: 'equal',
    length: 1,
  },
  establishedAt: {
    type: 'datetime',
  },
  categories: {
    type: 'strings',
  },
  gallery: {
    type: 'array',
    typeof: uploadModel,
  },
  coverURL: {},
  imageURL: {}
} // End of companyModel

export const companyUserModel: Attributes = {
  companyId: {
    key: true,
    match: 'equal',
    column: 'company_id'
  },

  userId: {
    key: true,
    match: 'equal',
    column: 'user_id'
  }
} // End of companyUserModel
