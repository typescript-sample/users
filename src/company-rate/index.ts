import { Log } from 'express-ext';
import { buildToSave, useUrlQuery } from 'pg-extension';
import { DB, SearchBuilder, SqlLoadRepository } from 'query-core';
import { TemplateMap, useQuery } from 'query-mappers';
import { infoModel, RatesService, RatesValidator } from 'rate-core';
import { SqlRatesRepository } from 'rate-query';
import {
  CommentFilter, CommentValidator, ReactionService
} from 'review-reaction';
import { RateCommentController, RateController, ReactionController } from 'review-reaction-express';
import {
  Comment,
  commentModel, CommentQuery, rateReactionModel,
  SqlCommentRepository,
  SqlInfoRepository,
  SqlReactionRepository
} from 'review-reaction-query';
import shortid from 'shortid';
import { check } from 'xvalidators';
import {
  RateCriteria,
  RateCriteriaFilter,
  rateCriteriaModel, RateFullInfo
} from './rate-criteria';

export function useRateCriteriaController(
  log: Log,
  db: DB,
  mapper?: TemplateMap
): RateController<RateCriteria> {
  const rateRepository = new SqlRatesRepository<RateCriteria>(
    db,
    'company_rate',
    'company_rate_full_info',
    [
      'company_rate_info01',
      'company_rate_info02',
      'company_rate_info03',
      'company_rate_info04',
      'company_rate_info05',
    ],
    rateCriteriaModel,
    buildToSave,
    5,
    'rate',
    'count',
    'score',
    'author',
    'id'
  );

  const infoRepository = new SqlInfoRepository<RateFullInfo>(
    db,
    'company_rate_full_info',
    infoModel,
    buildToSave
  );
  const rateValidator = new RatesValidator(rateCriteriaModel, check, 5, 5);
  const rateService = new RatesService(rateRepository, infoRepository);
  return new RateController(
    log, rateService.rate, rateValidator.validate, 'author', 'id'
  );
}

export function useRateCriteriaReactionService(db: DB, mapper?: TemplateMap): ReactionService<RateCriteria, RateCriteriaFilter> {
  const query = useQuery('company_rate', mapper, rateCriteriaModel, true);
  const builder = new SearchBuilder<RateCriteria, RateCriteriaFilter>(
    db.query,
    'company_rate',
    rateCriteriaModel,
    db.driver,
    query
  );

  const rateRepository = new SqlLoadRepository<RateCriteria, string, string>(
    db.query,
    'company_rate',
    rateCriteriaModel,
    db.param,
    'id',
    'author'
  );

  const rateReactionRepository = new SqlReactionRepository(
    db,
    'company_rate_reaction',
    rateReactionModel,
    'company_rate',
    'usefulCount',
    'author',
    'id'
  );
  const rateCommentRepository = new SqlCommentRepository<Comment>(
    db,
    'company_rate_comment',
    commentModel,
    'company_rate',
    'id',
    'author',
    'replyCount',
    'author',
    'id'
  );

  return new ReactionService<RateCriteria, RateCriteriaFilter>(
    builder.search,
    rateRepository,
    rateReactionRepository,
    rateCommentRepository
  );
}

export function useRateCriteriaReactionController(
  log: Log,
  db: DB,
  mapper?: TemplateMap
): ReactionController<RateCriteria, RateCriteriaFilter, Comment> {
  const commentValidator = new CommentValidator(commentModel, check);
  return new ReactionController(
    log,
    useRateCriteriaReactionService(db, mapper),
    commentValidator,
    ['time'],
    ['rates', 'usefulCount', 'replyCount', 'count', 'score'],
    generate,
    'commentId',
    'userId',
    'author',
    'id'
  );
}

export function useRateCriteriaCommentService(
  db: DB,
  mapper?: TemplateMap
): CommentQuery<Comment, CommentFilter> {
  const query = useQuery('company_rate_comment', mapper, commentModel, true);
  const builder = new SearchBuilder<Comment, CommentFilter>(
    db.query,
    'company_rate_comment',
    commentModel,
    db.driver,
    query
  );
  const rateCommentRepository = new SqlCommentRepository<Comment>(
    db,
    'company_rate_comment',
    commentModel,
    'company_rate',
    'id',
    'author',
    'replyCount',
    'author',
    'time',
    'id'
  );
  const queryUrl = useUrlQuery<string>(db.query, 'users', 'imageURL', 'id');
  return new CommentQuery(builder.search, rateCommentRepository, queryUrl);
}

export function useRateCriteriaCommentController(
  log: Log,
  db: DB,
  mapper?: TemplateMap
): RateCommentController<Comment> {
  return new RateCommentController(
    log,
    useRateCriteriaCommentService(db, mapper)
  );
}

// function binarySearch(ar: URL[], el: string): number {
//   let m = 0;
//   let n = ar.length - 1;
//   while (m <= n) {
//     // tslint:disable-next-line:no-bitwise
//     const k = (n + m) >> 1;
//     const cmp = compare(el, ar[k].id);
//     if (cmp > 0) {
//       m = k + 1;
//     } else if (cmp < 0) {
//       n = k - 1;
//     } else {
//       return k;
//     }
//   }
//   return -m - 1;
// }
// function compare(s1: string, s2: string): number {
//   return s1.localeCompare(s2);
// }

export function generate(): string {
  return shortid.generate();
}