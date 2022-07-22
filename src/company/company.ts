import { Attributes, Filter, Repository, Service } from 'onecore';

export interface Company {
  id: string;
  name: string;
  description: string;
  size: number;
  establishedAt: Date;
  catagories: string[];
}

export interface CompanyFilter extends Filter {
    id: string;
    name: string;
    description: string;
    size: number;
    establishedAt: Date;
    catagories: string[];
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
  establishedAt:{
    type:'datetime'
  },
  catagories:{
    type:'strings'
  }
};
