import { Log } from 'express-ext';
import { ErrorMessage, Search } from 'onecore';
import { buildToSave } from 'pg-extension';
import { Attributes, DB, SearchBuilder, SearchResult } from 'query-core';
import { TemplateMap, useQuery } from 'query-mappers';
import { Info, infoModel } from 'rate-core';
import { SqlRatesRepository } from 'rate-query';
import {
  CommentRepository,
  CommentValidator,
  ReactionRepository,
  ShortComment,
} from 'review-reaction';
import { ReactionController } from 'review-reaction-express';
import {
  Comment,
  commentModel,
  InfoRepository,
  rateReactionModel,
  SqlCommentRepository,
  SqlInfoRepository,
  SqlReactionRepository,
} from 'review-reaction-query';
import shortid from 'shortid';
import { check } from 'xvalidators';
import {
  RateCriteria,
  RateCriteriaFilter,
  rateCriteriaModel,
  RateCriteriaRepository,
  RateCriteriaService,
  RateFullInfo,
  ShortRate,
} from './rate-criteria';

export interface URL {
  id: string;
  url: string;
}
export class RateCriteriaManager implements RateCriteriaService {
  constructor(
    protected find: Search<RateCriteria, RateCriteriaFilter>,
    public repository: RateCriteriaRepository<RateCriteria>,
    public infoRepository: InfoRepository<RateFullInfo>,
    private commentRepository: CommentRepository,
    private rateReactionRepository: ReactionRepository,
    private queryURL?: (ids: string[]) => Promise<URL[]>
  ) {
    this.search = this.search.bind(this);
    this.load = this.load.bind(this);
    this.rate = this.rate.bind(this);
    this.getRate = this.getRate.bind(this);
    this.setUseful = this.setUseful.bind(this);
    this.removeUseful = this.removeUseful.bind(this);
    this.comment = this.comment.bind(this);
    this.removeComment = this.removeComment.bind(this);
    this.updateComment = this.updateComment.bind(this);
    this.getComments = this.getComments.bind(this);
    this.getComment = this.getComment.bind(this);
  }

  search(
    s: RateCriteria,
    limit?: number,
    offset?: number | string,
    fields?: string[]
  ): Promise<SearchResult<RateCriteria>> {
    return this.find(s, limit, offset, fields).then((res) => {
      if (!this.queryURL) {
        return res;
      } else {
        if (res.list && res.list.length > 0) {
          const ids: string[] = [];
          for (const rate of res.list) {
            ids.push(rate.author);
          }
          return this.queryURL(ids).then((urls) => {
            for (const rate of res.list) {
              const i = binarySearch(urls, rate.author);
              if (i >= 0) {
                rate.authorURL = urls[i].url;
              }
            }
            return res;
          });
        } else {
          return res;
        }
      }
    });
  }

  async load(id: string, author: string): Promise<RateCriteria | null> {
    return await this.repository.load(id, author);
  }

  async rate(rate: RateCriteria): Promise<number> {
    const info = await this.infoRepository.load(rate.id);
    const newRate = { ...rate, time: new Date() };

    if (!info) {
      const r0 = await this.repository.insert(newRate, true);
      return r0;
    }
    const exist = await this.repository.load(rate.id, rate.author);
    if (!exist) {
      const r1 = await this.repository.insert(newRate);
      return r1;
    }

    const sr: ShortRate = {
      review: exist.review,
      rates: exist.rates,
      time: exist.time,
    };
    if (exist.histories && exist.histories.length > 0) {
      const history = exist.histories;
      history.push(sr);
      rate.histories = history;
    } else {
      rate.histories = [sr];
    }
    const res = await this.repository.update(newRate, exist.rate);
    return res;
  }
  getRate(id: string, author: string): Promise<RateCriteria | null> {
    return this.repository.load(id, author);
  }
  setUseful(id: string, author: string, userId: string): Promise<number> {
    return this.rateReactionRepository.save(id, author, userId, 1);
  }
  removeUseful(id: string, author: string, userId: string): Promise<number> {
    return this.rateReactionRepository.remove(id, author, userId);
  }
  comment(comment: Comment): Promise<number> {
    return this.repository
      .load(comment.id, comment.author)
      .then((checkRate) => {
        if (!checkRate) {
          return -1;
        } else {
          comment.time
            ? (comment.time = comment.time)
            : (comment.time = new Date());
          return this.commentRepository.insert(comment);
        }
      });
  }
  removeComment(commentId: string, userId: string): Promise<number> {
    return this.commentRepository.load(commentId).then((comment) => {
      if (comment) {
        if (userId === comment.author || userId === comment.userId) {
          return this.commentRepository.remove(
            commentId,
            comment.id,
            comment.author
          );
        } else {
          return -2;
        }
      } else {
        return -1;
      }
    });
  }
  updateComment(comment: Comment): Promise<number> {
    return this.commentRepository.load(comment.commentId).then((exist) => {
      if (!exist) {
        return -1;
      } else {
        if (exist.userId !== comment.userId) {
          return -2;
        }
        exist.updatedAt = new Date();
        const c: ShortComment = { comment: exist.comment, time: exist.time };
        if (exist.histories && exist.histories.length > 0) {
          exist.histories.push(c);
        } else {
          exist.histories = [c];
        }
        exist.comment = comment.comment;
        const res = this.commentRepository.update(exist);
        return res;
      }
    });
  }
  getComments(id: string, author: string, limit?: number): Promise<Comment[]> {
    return this.commentRepository.getComments(id, author, limit);
  }
  getComment(id: string): Promise<Comment | null> {
    return this.commentRepository.load(id);
  }
}

export function useRateCriteriaService(
  db: DB,
  mapper?: TemplateMap
): RateCriteriaService {
  const query = useQuery('company_rate', mapper, rateCriteriaModel, true);
  const builder = new SearchBuilder<RateCriteria, RateCriteriaFilter>(
    db.query,
    'company_rate',
    rateCriteriaModel,
    db.driver,
    query
  );

  const repository = new SqlRatesRepository<RateCriteria>(
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

  const infoRepository = new SqlInfoRepository<Info>(
    db,
    'company_rate_full_info',
    infoModel,
    buildToSave
  );
  const rateReactionRepository = new SqlReactionRepository(
    db,
    'ratereaction',
    rateReactionModel,
    'rates',
    'usefulCount',
    'author',
    'id'
  );
  const rateCommentRepository = new SqlCommentRepository<Comment>(
    db,
    'rate_comments',
    commentModel,
    'rates',
    'id',
    'author',
    'replyCount',
    'author',
    'id'
  );
  return new RateCriteriaManager(
    builder.search,
    repository,
    infoRepository,
    rateCommentRepository,
    rateReactionRepository
  );
}

export function useRateCriteriaController(
  log: Log,
  db: DB,
  mapper?: TemplateMap
): ReactionController<RateCriteria, RateCriteriaFilter, Comment> {
  const rateValidator = new RateCriteriaValidator(rateCriteriaModel, check, 10);
  const commentValidator = new CommentValidator(commentModel, check);
  return new ReactionController(
    log,
    useRateCriteriaService(db, mapper),
    commentValidator,
    ['dates'],
    ['rate', 'usefulCount', 'replyCount', 'count', 'score'],
    generate,
    'commentId',
    'userId',
    'author',
    'id'
  );
}

function binarySearch(ar: URL[], el: string): number {
  let m = 0;
  let n = ar.length - 1;
  while (m <= n) {
    // tslint:disable-next-line:no-bitwise
    const k = (n + m) >> 1;
    const cmp = compare(el, ar[k].id);
    if (cmp > 0) {
      m = k + 1;
    } else if (cmp < 0) {
      n = k - 1;
    } else {
      return k;
    }
  }
  return -m - 1;
}
function compare(s1: string, s2: string): number {
  return s1.localeCompare(s2);
}
export class RateCriteriaValidator {
  constructor(
    protected attributes: Attributes,
    valid: (obj: any, attributes: Attributes) => ErrorMessage[],
    protected max: number
  ) {
    this.check = valid;
    this.validate = this.validate.bind(this);
  }
  protected check: (obj: any, attributes: Attributes) => ErrorMessage[];
  validate(rateCriteria: RateCriteria): Promise<ErrorMessage[]> {
    const errs = this.check(rateCriteria, this.attributes);
    for (const i in rateCriteria.rates) {
      if (rateCriteria.rates[i] > this.max) {
        const err = createError('rate', 'max', this.max);
        if (errs) {
          errs.push(err);
          return Promise.resolve(errs);
        } else {
          return Promise.resolve([err]);
        }
      }
    }
    return Promise.resolve(errs);
  }
}
function createError(
  field: string,
  code?: string,
  param?: string | number | Date
): ErrorMessage {
  if (!code) {
    code = 'string';
  }
  const error: ErrorMessage = { field, code };
  if (param) {
    error.param = param;
  }
  return error;
}
export function generate(): string {
  return shortid.generate();
}
