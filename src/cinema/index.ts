import { Log, Search, ViewSearchManager } from 'onecore';
import { buildToSave, useUrlQuery } from 'pg-extension';
import { DB, Repository, SearchBuilder, SqlLoadRepository } from 'query-core';
import { TemplateMap, useQuery } from 'query-mappers';
import {
  Info,
  infoModel,
  Rate,
  RateFilter,
  rateModel,
  RateService,
  RateValidator,
} from 'rate-core';
import { SqlRateRepository } from 'rate-query';
import {
  Comment,
  CommentFilter,
  CommentValidator,
  ReactionService,
} from 'review-reaction';
import {
  RateCommentController,
  RateController,
  ReactionController,
} from 'review-reaction-express';
import {
  commentModel,
  InfoRepository,
  rateReactionModel,
  SqlCommentRepository,
  SqlInfoRepository,
  SqlReactionRepository,
} from 'review-reaction-query';
import { CommentQuery } from 'review-reaction-query';
import shortid from 'shortid';
import { check } from 'xvalidators';
import {
  Cinema,
  CinemaFilter,
  cinemaModel,
  CinemaRepository,
  CinemaQuery,
} from './cinema';

import { QueryController } from 'express-ext';

export class CinemaController extends QueryController<Cinema, string, CinemaFilter> {
  constructor(log: Log, cinemaService: CinemaQuery) {
    super(log, cinemaService);
  }
}

export class CinemaService
  extends ViewSearchManager<Cinema, string, CinemaFilter>
  implements CinemaQuery {
  constructor(
    search: Search<Cinema, CinemaFilter>,
    protected repository: CinemaRepository,
    private infoRepository: InfoRepository<Info>
  ) {
    super(search, repository);
  }

  load(id: string): Promise<Cinema | null> {
    return this.repository.load(id).then((cinema) => {
      if (!cinema) {
        return null;
      } else {
        return this.infoRepository.load(id).then((info) => {
          if (info) {
            delete (info as any)['id'];
            delete (info as any)['count'];
            delete (info as any)['score'];
            cinema.info = info;
          }
          return cinema;
        });
      }
    });
  }
}

export function useCinemaController(log: Log, db: DB, mapper?: TemplateMap): CinemaController {
  const query = useQuery('cinema', mapper, cinemaModel, true);
  const builder = new SearchBuilder<Cinema, CinemaFilter>(db.query, 'cinema', cinemaModel, db.driver, query);
  const repository = new Repository<Cinema, string>(db, 'cinema', cinemaModel);
  const infoRepository = new SqlInfoRepository<Info>(db, 'cinemainfo', infoModel, buildToSave);
  const service = new CinemaService(builder.search, repository, infoRepository)
  return new CinemaController(log, service);
}

export function useCinemaRateController(log: Log, db: DB, mapper?: TemplateMap): RateController<Rate> {
  const rateRepository = new SqlRateRepository<Rate>(db, 'cinemarate', rateModel, buildToSave, 5, 'cinemainfo', 'rate', 'count', 'score', 'author', 'id');
  const infoRepository = new SqlInfoRepository<Info>(db, 'cinemainfo', infoModel, buildToSave);
  const rateValidator = new RateValidator(rateModel, check, 5);
  const rateService = new RateService(rateRepository, infoRepository);
  return new RateController(log, rateService.rate, rateValidator.validate, 'author', 'id');
}

export function useCinemaReactionController(log: Log, db: DB, mapper?: TemplateMap): ReactionController<Rate, RateFilter, Comment> {
  const commentValidator = new CommentValidator(commentModel, check);
  const query = useQuery('cinemarate', mapper, rateModel, true);
  const builder = new SearchBuilder<Rate, RateFilter>(db.query, 'cinemarate', rateModel, db.driver, query);
  const rateRepository = new SqlLoadRepository<Rate, string, string>(db.query, 'cinemarate', rateModel, db.param, 'id', 'author');
  const rateReactionRepository = new SqlReactionRepository(db, 'cinemaratereaction', rateReactionModel, 'cinemarate', 'usefulCount', 'author', 'id');
  const rateCommentRepository = new SqlCommentRepository<Comment>(db, 'cinemaratecomment', commentModel, 'cinemarate', 'id', 'author', 'replyCount', 'author', 'id');
  const service = new ReactionService(builder.search, rateRepository, rateReactionRepository, rateCommentRepository)
  return new ReactionController(
    log, service, commentValidator, ['time'], ['rate', 'usefulCount', 'replyCount', 'count', 'score'],
    generate, 'commentId', 'userId', 'author', 'id');
}

export function useCinemaRateCommentController(log: Log, db: DB, mapper?: TemplateMap): RateCommentController<Comment> {
  const query = useQuery('cinemaratecomment', mapper, commentModel, true);
  const builder = new SearchBuilder<Comment, CommentFilter>(db.query, 'cinemaratecomment', commentModel, db.driver, query);
  const rateCommentRepository = new SqlCommentRepository<Comment>(db, 'cinemaratecomment', commentModel, 'cinemarate', 'id', 'author', 'replyCount', 'author', 'time', 'id');
  const queryUrl = useUrlQuery<string>(db.query, 'users', 'imageURL', 'id');
  const service = new CommentQuery(builder.search, rateCommentRepository, queryUrl);
  return new RateCommentController(log, service);
}

export function generate(): string {
  return shortid.generate();
}
