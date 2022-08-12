import { Build, Log } from 'express-ext';
import { Manager, Search } from 'onecore';
import { buildToSave } from 'pg-extension';
import { DB, SearchBuilder, SqlLoadRepository } from 'query-core';
import { TemplateMap, useQuery } from 'query-mappers';
import { Info10, info10Model, Rate, RateFilter, rateModel, RateService, RateValidator } from 'rate-core';
import { SqlRateRepository } from 'rate-query';
import { Comment, CommentFilter, CommentValidator, ReactionService } from 'review-reaction';
import { RateCommentController, RateController, ReactionController } from 'review-reaction-express';
import { commentModel, CommentQuery, rateReactionModel, SqlCommentRepository, SqlInfoRepository, SqlReactionRepository } from 'review-reaction-query';
import { check } from 'xvalidators';
import { Appreciation, AppreciationFilter, AppreciationId, appreciationModel, AppreciationRepository, AppreciationService, Reply, ReplyFilter, ReplyId, replyModel, ReplyRepository, ReplyService, Useful, usefulModel, UsefulRepository } from './appreciation';

export * from './appreciation';

export function useAppreciationController(log: Log, db: DB, mapper?: TemplateMap): RateController<Rate> {
  const rateRepository = new SqlRateRepository<Rate>(db, 'appreciation', rateModel, buildToSave, 10, 'appreciationinfo', 'rate', 'count', 'score', 'author', 'id');
  const infoRepository = new SqlInfoRepository<Info10>(db, 'appreciationinfo', info10Model, buildToSave);
  const rateValidator = new RateValidator(rateModel, check, 10);
  const rateService = new RateService(rateRepository, infoRepository);
  return new RateController(log, rateService.rate, rateValidator.validate, 'author', 'id');
}

export function useAppreciationReactionController(log: Log, db: DB,generate:()=>string, mapper?: TemplateMap): ReactionController<Rate, RateFilter, Comment> {
  const query = useQuery('appreciation', mapper, rateModel, true);
  const builder = new SearchBuilder<Rate, RateFilter>(db.query, 'appreciation', rateModel, db.driver, query);
  const rateRepository = new SqlLoadRepository<Rate, string, string>(db.query, 'appreciation', rateModel, db.param, 'id', 'author');
  const rateReactionRepository = new SqlReactionRepository(db, 'appreciationreaction', rateReactionModel, 'appreciation', 'usefulCount', 'author', 'id');
  const rateCommentRepository = new SqlCommentRepository<Comment>(db, 'appreciationcomment', commentModel, 'appreciation', 'id', 'author', 'replyCount', 'author', 'time', 'id');
  const service = new ReactionService<Rate, RateFilter>(builder.search, rateRepository, rateReactionRepository, rateCommentRepository);
  const commentValidator = new CommentValidator(commentModel, check);
  return new ReactionController(log, service, commentValidator, ['time'], ['rate', 'usefulCount', 'replyCount', 'count', 'score'],
    generate, 'commentId', 'userId', 'author', 'id');
}

export function useAppreciationCommentController(log: Log, db: DB, mapper?: TemplateMap): RateCommentController<Comment> {
  const query = useQuery('appreciationcomment', mapper, commentModel, true);
  const builder = new SearchBuilder<Comment, CommentFilter>(db.query, 'appreciationcomment', commentModel, db.driver, query);
  const rateCommentRepository = new SqlCommentRepository<Comment>(db, 'appreciationcomment', commentModel, 'appreciation', 'id', 'author', 'replyCount', 'author', 'time', 'id');
  const service = new CommentQuery<Comment, CommentFilter>(builder.search, rateCommentRepository);
  return new RateCommentController(log, service);
}
