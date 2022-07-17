import { Attributes, Filter, Repository, Service } from 'onecore';

export interface ArticleFilter extends Filter {
  id?: string;
  title?: string;
  type?: string;
  tags?: string[];
  status?: string[] | string;
  authorId?: string;
}
export interface Article {
  id?: string;
  title?: string;
  type?: string;
  description?: string;
  content?: string;
  publishAt?: Date;
  categories?: string[];
  tags?: string[];
  status?: string;
  authorId?: string;
}
export interface ArticleRepository extends Repository<Article, string> {
}
export interface ArticleService extends Service<Article, string, ArticleFilter> {
}

export const articleModel: Attributes = {
  id: {
    key: true
  },
  authorId: {
    required: true,
    q: true
  },
  name: {
    required: true,
    q: true
  },
  type: {
    match: 'equal',
    required: true
  },
  description: {
    q: true
  },
  content: {
    q: true
  },
  status: {
    match: 'equal'
  },
  tags: {
    type: 'strings',
    match: 'equal'
  },
  imageURL: {}
};
