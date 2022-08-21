import { UploadInfo, uploadModel } from 'one-storage';
import { Attributes, Filter, NumberRange, Repository, Service } from 'onecore';

export interface Company {
  id: string;
  name: string;
  description: string;
  address: string;
  size: number;
  status: string;
  establishedAt: Date;
  categories: string[];
  imageURL?: string;
  coverURL?: string;
  gallery?: UploadInfo[];
}

export interface CompanyFilter extends Filter {
  id?: string;
  name?: string;
  description?: string;
  address?: string;
  size?: NumberRange;
  status?: string;
  establishedAt?: Date;
  categories?: string[];
}
export interface CompanyRepository extends Repository<Company, string> { }

export interface CompanyService extends Service<Company, string, CompanyFilter> { }

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
  imageURL: {},
};
