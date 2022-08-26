
import { LoadSearchHandler } from 'express-ext';
import { Log, ViewManager } from 'onecore';
import { buildToSave, useUrlQuery } from 'pg-extension';
import { DB, postgres, Repository, SearchBuilder, SqlLoadRepository } from 'query-core';
import { TemplateMap, useQuery } from 'query-mappers';
import {
  Info,
  infoModel,
  Rate,
  RateFilter,
  rateModel,
  RateService,
  RateValidator
} from 'rate-core';
import { SqlRateRepository } from 'rate-query';
import {
  Comment,
  CommentFilter,
  CommentValidator,
  ReactionService
} from 'review-reaction';
import {
  RateCommentController,
  RateController,
  ReactionController
} from 'review-reaction-express';
import {
  commentModel, CommentQuery, rateReactionModel,
  SqlCommentRepository,
  SqlInfoRepository,
  SqlReactionRepository
} from 'review-reaction-query';
import shortid from 'shortid';
import { check } from 'xvalidators';
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
export function useArticleRateController(log: Log, db: DB, mapper?: TemplateMap): RateController<Rate> {
  const rateRepository = new SqlRateRepository<Rate>(db, 'articlerate', rateModel, buildToSave, 5, 'articleinfo', 'rate', 'count', 'score', 'author', 'id');
  const infoRepository = new SqlInfoRepository<Info>(db, 'articleinfo', infoModel, buildToSave);
  const rateValidator = new RateValidator(rateModel, check, 5);
  const rateService = new RateService(rateRepository, infoRepository);
  return new RateController(log, rateService.rate, rateValidator.validate, 'author', 'id');
}

export function useArticleReactionController(log: Log, db: DB, mapper?: TemplateMap): ReactionController<Rate, RateFilter, Comment> {
  const commentValidator = new CommentValidator(commentModel, check);
  const query = useQuery('articlerate', mapper, rateModel, true);
  const builder = new SearchBuilder<Rate, RateFilter>(db.query, 'articlerate', rateModel, db.driver, query);
  const rateRepository = new SqlLoadRepository<Rate, string, string>(db.query, 'articlerate', rateModel, db.param, 'id', 'author');
  const rateReactionRepository = new SqlReactionRepository(db, 'articleratereaction', rateReactionModel, 'articlerate', 'usefulCount', 'author', 'id');
  const rateCommentRepository = new SqlCommentRepository<Comment>(db, 'articleratecomment', commentModel, 'articlerate', 'id', 'author', 'replyCount', 'author', 'id');
  const queryUrl = useUrlQuery<string>(db.query, 'users', 'imageURL', 'id');
  const service = new ReactionService(builder.search, rateRepository, rateReactionRepository, rateCommentRepository, queryUrl);
  return new ReactionController(
    log, service, commentValidator, ['time'], ['rate', 'usefulCount', 'replyCount', 'count', 'score'],
    generate, 'commentId', 'userId', 'author', 'id');
}

export function useArticleRateCommentController(log: Log, db: DB, mapper?: TemplateMap): RateCommentController<Comment> {
  const query = useQuery('articleratecomment', mapper, commentModel, true);
  const builder = new SearchBuilder<Comment, CommentFilter>(db.query, 'articleratecomment', commentModel, db.driver, query);
  const rateCommentRepository = new SqlCommentRepository<Comment>(db, 'articleratecomment', commentModel, 'cinemarate', 'id', 'author', 'replyCount', 'author', 'time', 'id');
  const queryUrl = useUrlQuery<string>(db.query, 'users', 'imageURL', 'id');
  const service = new CommentQuery(builder.search, rateCommentRepository, queryUrl);
  return new RateCommentController(log, service);
}

export function generate(): string {
  return shortid.generate();
}

