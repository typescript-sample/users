import { LoadSearchHandler, Log } from 'express-ext';
import { ViewManager } from 'onecore';
import { DB, postgres, Repository, SearchBuilder } from 'query-core';
import { TemplateMap, useQuery } from 'query-mappers';
import { Article, ArticleFilter, articleModel, ArticleRepository, ArticleService } from './article';
export * from './article';

export class ArticleManager extends ViewManager<Article, string> implements ArticleService {
  constructor(repository: ArticleRepository) {
    super(repository);
  }
}

export function useArticleController(log: Log, db: DB, mapper?: TemplateMap): LoadSearchHandler<Article, string, ArticleFilter> {
  const queryArticles = useQuery('article', mapper, articleModel, true);
  const builder = new SearchBuilder<Article, ArticleFilter>(db.query, 'article', articleModel, postgres, queryArticles);
  const repository = new Repository<Article, string>(db, 'article', articleModel);
  const service = new ArticleManager(repository);
  return new LoadSearchHandler<Article, string, ArticleFilter>(log, builder.search, service);
}
