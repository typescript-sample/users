import { Attributes, Filter, Service } from 'onecore';
import { Repository } from 'query-core';

export interface CompanyCategoryFilter extends Filter {
  id?: string;
  categoryName?: string;
}
export interface CompanyCategory {
  categoryId: string;
  categoryName: string;
}
export interface CompanyCategoryRepository extends Repository<CompanyCategory, string>{

}
export interface CompanyCategoryService extends Service<CompanyCategory, string, CompanyCategoryFilter> {

}

export const companyCategoryModel: Attributes = {
  categoryId: {
    key: true,
    length: 40,
    q:true,
  },
  categoryName: {
    required: true,
    length: 300,
    q:true
  },
  createdBy: {},
  createdAt: {
    type: 'datetime'
  },
  updatedBy: {},
  updatedAt: {
    type: 'datetime'
  },
};
