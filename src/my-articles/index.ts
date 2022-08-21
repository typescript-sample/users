import { Log, Manager, Search } from 'onecore';
import { DB, postgres, Repository, SearchBuilder } from 'query-core';
import { TemplateMap, useQuery } from 'query-mappers';
import { Article, ArticleFilter, articleModel, ArticleRepository, ArticleService } from './article';
export * from './article';
import { Build, Controller} from 'express-ext';

export class ArticleController extends Controller<Article, string, ArticleFilter> {
  constructor(log: Log, service: ArticleService, build?: Build<Article>) {
    super(log, service, build);
  }
}

export class ArticleManager extends Manager<Article, string, ArticleFilter> implements ArticleService {
  constructor(search: Search<Article, ArticleFilter>, repository: ArticleRepository) {
    super(search, repository);
  }
}

export function useMyArticleController(log: Log, db: DB, mapper?: TemplateMap): ArticleController {
  const queryArticles = useQuery('article', mapper, articleModel, true);
  const builder = new SearchBuilder<Article, ArticleFilter>(db.query, 'article', articleModel, postgres, queryArticles);
  const repository = new Repository<Article, string>(db, 'article', articleModel);
  const service = new ArticleManager(builder.search, repository);
  return new ArticleController(log, service);
}
