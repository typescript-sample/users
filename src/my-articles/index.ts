import { Log, Manager, Search } from 'onecore';
import { DB, postgres, SearchBuilder } from 'query-core';
import { TemplateMap, useQuery } from 'query-mappers';
import { Article, ArticleFilter, articleModel, ArticleRepository, ArticleService } from './article';
import { ArticleController } from './article-controller';
export * from './article';
export { ArticleController };

import { SqlArticleRepository } from './sql-article-repository';

export class ArticleManager extends Manager<Article, string, ArticleFilter> implements ArticleService {
  constructor(search: Search<Article, ArticleFilter>, repository: ArticleRepository) {
    super(search, repository);
  }
}

export function useArticleService(db: DB, mapper?: TemplateMap): ArticleService {
  const queryArticles = useQuery('article', mapper, articleModel, true);
  const builder = new SearchBuilder<Article, ArticleFilter>(db.query, 'articles', articleModel, postgres, queryArticles);
  const repository = new SqlArticleRepository(db);
  return new ArticleManager(builder.search, repository);
}
export function useMyArticleController(log: Log, db: DB, mapper?: TemplateMap): ArticleController {
  return new ArticleController(log, useArticleService(db, mapper));
}
