import { Attributes, Filter, Repository, Query,Service,NumberRange } from 'onecore';

export interface Company {
  id: string;
  name: string;
  description: string;
  size: number;
  status: string;
  establishedAt: Date;
  categories: string[];
}

export interface CompanyFilter extends Filter {
    id?: string;
    name?: string;
    description?: string;
    size?: NumberRange;
    status?: string;
    establishedAt?: Date;
    categories?: string[];
}
export interface CompanyRepository extends Repository<Company, string> {
}
export interface CompanyService extends Service<Company, string, CompanyFilter> {
}
export const companyModel: Attributes = {
  id: {
    key: true,
    match: 'equal'
  },
  name: {
    length:120
  },
  description: {
    length:1000
  },
  size: {
    type:'number'
  },
  status: {
    match: 'equal',
    length: 1
  },
  establishedAt:{
    type:'datetime'
  },
  categories:{
    type:'strings'
  }
};
