import { CommentReactionClient, CommentReactionController, commentReactionModel, CommentThread, CommentThreadClient, CommentThreadController, CommentThreadFilter, commentThreadModel, commentThreadReplyModel, CommentThreadRepository, CommentThreadValidator, SqlCommentReactionRepository, SqlCommentThreadReplyRepository, SqlCommentThreadRepository } from '../comment-thread';
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
  // ReactionService
} from 'review-reaction';
import { ReactionService } from '../review-reaction'
import {
  RateCommentController,
  RateController,
  // ReactionController
} from 'review-reaction-express';
import { ReactionController } from "review-reaction-express"
import {
  commentModel, CommentQuery, rateReactionModel,
  // SqlCommentRepository,
  SqlInfoRepository,
  SqlReactionRepository
} from '../review-reaction-query';
import { SqlCommentRepository } from 'review-reaction-query'
import shortid from 'shortid';
import { check } from 'xvalidators';
import { Article, ArticleFilter, articleModel, ArticleRepository, ArticleService } from './article';
export * from './article';
import { useInfoQuery } from '../rate-user-query';

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
  const queryInfo = useInfoQuery<string>(db.query, 'users', 'imageURL', 'id', 'username', 'displayname');
  const service = new ReactionService(builder.search, rateRepository, rateReactionRepository, rateCommentRepository, queryInfo);
  return new ReactionController(
    log, service, commentValidator, ['time'], ['rate', 'usefulCount', 'replyCount', 'count', 'score'],
    generate, 'commentId', 'userId', 'author', 'id');
}

export function useArticleRateCommentController(log: Log, db: DB, mapper?: TemplateMap): RateCommentController<Comment> {
  const query = useQuery('articleratecomment', mapper, commentModel, true);
  const builder = new SearchBuilder<Comment, CommentFilter>(db.query, 'articleratecomment', commentModel, db.driver, query);
  const rateCommentRepository = new SqlCommentRepository<Comment>(db, 'articleratecomment', commentModel, 'articlerate', 'id', 'author', 'replyCount', 'author', 'time', 'id');
  const queryInfo = useInfoQuery<string>(db.query, 'users', 'imageURL', 'id', 'username', 'displayname');
  const service = new CommentQuery(builder.search, rateCommentRepository, queryInfo);
  return new RateCommentController(log, service);
}

export function generate(): string {
  return shortid.generate();
}

export function useArticleCommentThreadController(log: Log, db: DB, mapper?: TemplateMap): CommentThreadController<CommentThread> {
  const commentThreadRepository = new SqlCommentThreadRepository(db, "articlecommentthread", commentThreadModel, "commentid", "id", "author", "comment", "time", "articlecomment", "commentId", "commentThreadId", "articlecommentthreadinfo", "commentId", "articlecommentinfo", "commentId", "articlecommentthreadreaction", "commentId", "articlecommentreaction", "commentId")
  const commentThreadReplyRepository = new SqlCommentThreadReplyRepository(db, 'articlecomment', commentThreadReplyModel, "commentId", "author", "commentThreadId", "userId", "articlecommentthreadinfo", "commentId", "replyCount", "usefulCount",
    "users", "id", "username", "imageurl", "articlecommentinfo", "commentId", "usefulCount", "articlecommentreaction", "commentId", "reaction")
  const commentThreadValidator = new CommentThreadValidator(commentThreadModel, check)
  const query = useQuery('articlecommentthread', mapper, commentThreadModel, true)
  const queryInfo = useInfoQuery<string>(db.query, 'users', 'imageURL', 'id', 'username', 'displayname');
  const builder = new SearchBuilder<CommentThread, CommentThreadFilter>(db.query, 'articlecommentthread', commentThreadModel, db.driver, query);
  const commentThreadService = new CommentThreadClient(builder.search, commentThreadRepository, commentThreadReplyRepository, queryInfo)
  return new CommentThreadController(log, commentThreadService, commentThreadValidator, "commentId", "id", "author", "userId", "comment", "commentThreadId", "parent", generate, "articlecomment", "commentId", "comment")
}

export function useArticleCommentThreadReactionController(log: Log, db: DB, mapper?: TemplateMap) {
  const commentReactionRepository = new SqlCommentReactionRepository(db, "articlecommentthreadreaction", commentReactionModel, "articlecommentthreadinfo", "usefulcount", "commentId", "userId", "author", "commentId")
  const commentReactionService = new CommentReactionClient(commentReactionRepository)
  return new CommentReactionController(log, commentReactionService, "commentId", "author", "userId")
}

export function useArticleCommentReactionController(log: Log, db: DB, mapper?: TemplateMap) {
  const commentReactionRepository = new SqlCommentReactionRepository(db, "articlecommentreaction", commentReactionModel, "articlecommentinfo", "usefulcount", "commentId", "userId", "author", "commentId")
  const commentReactionService = new CommentReactionClient(commentReactionRepository)
  return new CommentReactionController(log, commentReactionService, "commentId", "author", "userId")
}
