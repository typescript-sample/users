import { Log } from 'express-ext';
import { Attributes, Filter, Info10, Repository, Service } from 'onecore';
import { buildToSave } from 'pg-extension';
import { DB, SearchBuilder, SqlLoadRepository } from 'query-core';
import { TemplateMap, useQuery } from 'query-mappers';
import { info10Model, Rate, RateService, RateValidator } from 'rate-core';
import { SqlRateRepository } from 'rate-query';
import { ReactionService } from 'review-reaction';
import { RateController } from 'review-reaction-express';
import { commentModel, rateReactionModel, SqlCommentRepository, SqlInfoRepository, SqlReactionRepository } from 'review-reaction-query';
import { check } from 'xvalidators';

export interface AppreciationFilter extends Filter {
  id?: string;
  author?: string;
  title?: string;
  review?: string;
  createAt?: Date;
  replyCount?: number;
}
export interface AppreciationId {
  id: string;
  author: string;
}
export interface Appreciation {
  id: string;
  author: string;
  title: string;
  review: string;
  time: Date;
  updateAt: Date;
  histories?: Histories[];
  replyCount?: number;
}

export interface Histories {
  time: Date;
  review: string;
  title: string;
}

export function useAppreciationController(
  log: Log,
  db: DB,
  mapper?: TemplateMap
): RateController<Rate> {
  const rateRepository = new SqlRateRepository<Rate>(
    db,
    'appreciation',
    appreciationModel,
    buildToSave,
    10,
    'appreciation_info',
    'rate',
    'count',
    'score',
    'author',
    'id'
  );
  const infoRepository = new SqlInfoRepository<Info10>(
    db,
    'appreciation_info',
    info10Model,
    buildToSave
  );
  const rateValidator = new RateValidator(appreciationModel, check, 10);
  const rateService = new RateService(rateRepository, infoRepository);
  return new RateController(
    log,
    rateService.rate,
    rateValidator.validate,
    'author',
    'id'
  );
}

// Reaction
export function useAppreciationService(
  db: DB,
  mapper?: TemplateMap
): ReactionService<Appreciation, AppreciationFilter> {
  const query = useQuery('rates_film', mapper, appreciationModel, true);
  const builder = new SearchBuilder<Appreciation, AppreciationFilter>(
    db.query,
    'appreciation',
    appreciationModel,
    db.driver,
    query
  );
  const rateRepository = new SqlLoadRepository<Appreciation, string, string>(
    db.query,
    'rates_film',
    appreciationModel,
    db.param,
    'id',
    'author'
  );
  const rateReactionRepository = new SqlReactionRepository(
    db,
    'appreciation_reaction',
    rateReactionModel,
    'rates_film',
    'usefulCount',
    'author',
    'id'
  );
  const rateCommentRepository = new SqlCommentRepository<Comment>(
    db,
    'reply',
    commentModel,
    'rates_film',
    'id',
    'author',
    'replyCount',
    'author',
    'time',
    'id'
  );
  return new ReactionService<Rate, RateFilter>(
    builder.search,
    rateRepository,
    rateReactionRepository,
    rateCommentRepository
  );
}

const rateRepository = new SqlLoadRepository<Appreciation, string, string>(
  db.query,
  'appreciation',
  rateModel,
  db.param,
  'id',
  'author'
);
const rateReactionRepository = new SqlReactionRepository(
  db,
  'rates_film_reaction',
  rateReactionModel,
  'rates_film',
  'usefulCount',
  'author',
  'id'
);
const rateCommentRepository = new SqlCommentRepository<Comment>(
  db,
  'rates_film_comments',
  commentModel,
  'rates_film',
  'id',
  'author',
  'replyCount',
  'author',
  'time',
  'id'
);

export interface AppreciationRepository extends Repository<Appreciation, AppreciationId> {
  getAppreciation(id: string, author: string): Promise<Appreciation | null>;
  increaseReplyCount(id: string, author: string, ctx?: any): Promise<number>;
  decreaseReplyCount(id: string, author: string, ctx?: any): Promise<number>;
}
// export interface AppreciationService extends Service<Appreciation, AppreciationId, AppreciationFilter> {
//   reply(reply: Reply): Promise<boolean>;
//   removeReply(id: string, author: string, userId: string, ctx?: any): Promise<number>;
//   updateReply(reply: Reply): Promise<number>;
//   setUseful(id: string, author: string, userId: string, ctx?: any): Promise<number>;
//   getReplys(id: string, author: string, ctx?: any): Promise<Reply[]>;
// }

export const appreciationModel: Attributes = {
  id: {
    key: true,
    length: 40,
    required: true,
  },
  author: {
    key: true,
    required: true,
    length: 255,
  },
  title: {
    length: 255
  },
  review: {
    length: 255
  },
  time: {
    type: 'datetime'
  },
  updateAt: {
    type: 'datetime'
  },
  histories: {

  },
  replyCount: {
    type: 'integer',
    min: 0
  }
};

export interface ReplyFilter extends Filter {
  id?: string;
  author?: string;
  userId?: string;
  title?: string;
  review?: string;
  createdAt?: Date;
  updatedAt?: Date;
  appreciationId?: string;
}
export interface Reply {
  id: string;
  author: string;
  userId: string;
  review: string;
  time: Date;
  updateAt: Date;
}
export interface ReplyRepository extends Repository<Reply, ReplyId> {
  getReply(id: string, author: string, userId: string): Promise<Reply | null>;
  getReplys(id: string, author: string): Promise<Reply[]>;
  save(obj: Reply, ctx?: any): Promise<number>;
  removeReply(id: string, author: string, userId: string, ctx?: any): Promise<number>;
  increaseUsefulCount(id: string, author: string, userId: string, ctx?: any): Promise<number>;
  decreaseUsefulCount(id: string, author: string, userId: string, ctx?: any): Promise<number>;
}
export interface ReplyService extends Service<Reply, ReplyId, ReplyFilter> {
}

export interface ReplyId {
  id: string;
  author: string;
  userId: string;
}

export const replyModel: Attributes = {
  id: {
    key: true,
    required: true,
    match: 'equal'
  },
  userId: {
    key: true,
    required: true,
    match: 'equal'
  },
  author: {
    key: true,
    required: true,
    match: 'equal'
  },
  title: {
    length: 255
  },
  review: {
    length: 255
  },
  time: {
    type: 'datetime'
  },
  updateAt: {
    type: 'datetime'
  },
};

export interface UsefulId {
  id: string;
  author: string;
  userId: string;
}
export interface UsefulFilter extends Filter {
  id?: string;
  userId?: string;
  author?: string;
  reviewTime?: Date;
}
export interface Useful {
  id: string;
  author: string;
  userId: string;
  reviewTime: Date;
}
export interface UsefulRepository {
  getUseful(id: string, author: string, userId: string): Promise<Useful | null>;
  removeUseful(id: string, author: string, userId: string, ctx?: any): Promise<number>;
  save(obj: Useful, ctx?: any): Promise<number>;
}

export const usefulModel: Attributes = {
  userId: {
    required: true,
    length: 255,
  },
  appreciationId: {
    required: true,
    length: 255,
  },
  createdAt: {
    type: 'datetime'
  },
  updatedAt: {
    type: 'datetime'
  },
};
