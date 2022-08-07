import { Log, ViewManager } from 'onecore';
import { DB, postgres, SearchBuilder } from 'query-core';
import { TemplateMap, useQuery } from 'query-mappers';
import { Article, ArticleFilter, articleModel, ArticleRepository, ArticleService } from './article';
import { ArticleController } from './article-controller';
import { SqlArticleRepository } from './sql-article-repository';

export * from './article';
export { ArticleController };

export class ArticleManager extends ViewManager<Article, string> implements ArticleService {
  constructor(repository: ArticleRepository) {
    super(repository);
  }
}

export function useArticleController(log: Log, db: DB, mapper?: TemplateMap): ArticleController {
  const queryArticles = useQuery('articles', mapper, articleModel, true);
  const builder = new SearchBuilder<Article, ArticleFilter>(db.query, 'articles', articleModel, postgres, queryArticles);
  const repository = new SqlArticleRepository(db);
  const service = new ArticleManager(repository);
  return new ArticleController(log, builder.search, service);
}
