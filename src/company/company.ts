import { Attributes, Filter, Info, NumberRange, Repository, Query } from 'onecore';

export interface Company {
  id: string;
  name: string;
  description: string;
  address: string;
  size: number;
  status: string;
  establishedAt: Date;
  categories: string[];
  info?: Info;
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
  info?: Info;
}
export interface CompanyRepository extends Repository<Company, string> {

}
export interface CompanyQuery extends Query<Company, string, CompanyFilter> {

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
};
