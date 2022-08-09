import { Log, Search,ViewSearchManager } from 'onecore';
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
  Location,
  LocationFilter,
  locationModel,
  LocationRepository,
  LocationQuery,
} from './location';
import { LocationController } from './location-controller';
export * from './location-controller';
export { LocationController };

export class LocationService
  extends ViewSearchManager<Location, string, LocationFilter>
  implements LocationQuery {
  constructor(
    search: Search<Location, LocationFilter>,
    protected repository: LocationRepository,
    private infoRepository: InfoRepository<Info>
  ) {
    super(search, repository);
  }
  load(id: string): Promise<Location | null> {
    return this.repository.load(id).then((location) => {
      if (!location) {
        return null;
      } else {
        return this.infoRepository.load(id).then((info) => {
          if (info) {
            delete (info as any)['id'];
            delete (info as any)['count'];
            delete (info as any)['score'];
            location.info = info;
          }
          return location;
        });
      }
    });
  }
}

export function useLocationService(
  db: DB,
  mapper?: TemplateMap
): LocationQuery {
  const query = useQuery('location', mapper, locationModel, true);
  const builder = new SearchBuilder<Location, LocationFilter>(
    db.query,
    'location',
    locationModel,
    db.driver,
    query
  );
  const repository = new Repository<Location, string>(db, 'location', locationModel);
  const infoRepository = new SqlInfoRepository<Info>(
    db,
    'locationinfo',
    infoModel,
    buildToSave
  );
  return new LocationService(builder.search, repository, infoRepository);
}

export function useLocationController(
  log: Log,
  db: DB,
  mapper?: TemplateMap
): LocationController {
  return new LocationController(log, useLocationService(db, mapper));
}

// Rate
export function useLocationRateController(
  log: Log,
  db: DB,
  mapper?: TemplateMap
): RateController<Rate> {
  const rateRepository = new SqlRateRepository<Rate>(
    db,
    'locationrates',
    rateModel,
    buildToSave,
    5,
    'locationinfo',
    'rate',
    'count',
    'score',
    'author',
    'id'
  );
  const infoRepository = new SqlInfoRepository<Info>(
    db,
    'info',
    infoModel,
    buildToSave
  );
  const rateValidator = new RateValidator(rateModel, check, 5);
  const rateService = new RateService(rateRepository, infoRepository);
  return new RateController(
    log,
    rateService.rate,
    rateValidator.validate,
    'author',
    'id'
  );
}

export function useLocationReactionService(
  db: DB,
  mapper?: TemplateMap
): ReactionService<Rate, RateFilter> {
  const query = useQuery('locationrates', mapper, rateModel, true);
  const builder = new SearchBuilder<Rate, RateFilter>(
    db.query,
    'locationrates',
    rateModel,
    db.driver,
    query
  );
  const rateRepository = new SqlLoadRepository<Rate, string, string>(
    db.query,
    'locationrates',
    rateModel,
    db.param,
    'id',
    'author'
  );
  const rateReactionRepository = new SqlReactionRepository(
    db,
    'locationratereactions',
    rateReactionModel,
    'locationrates',
    'usefulCount',
    'author',
    'id'
  );
  const rateCommentRepository = new SqlCommentRepository<Comment>(
    db,
    'locationcomments',
    commentModel,
    'locationrates',
    'id',
    'author',
    'replyCount',
    'author',
    'id'
  );
  // const queryUrl = useUrlQuery<string>(db.query, "users", "imageURL", "id");
  return new ReactionService<Rate, RateFilter>(
    builder.search,
    rateRepository,
    rateReactionRepository,
    rateCommentRepository,
    // queryUrl
  );
}

export function useLocationReactionController(
  log: Log,
  db: DB,
  mapper?: TemplateMap
): ReactionController<Rate, RateFilter, Comment> {
  const commentValidator = new CommentValidator(commentModel, check);
  return new ReactionController(
    log,
    useLocationReactionService(db, mapper),
    commentValidator,
    ['time'],
    ['rate', 'usefulCount', 'replyCount', 'count', 'score'],
    generate,
    'commentId',
    'userId',
    'author',
    'id'
  );
}

// Comment
export function useLocationRateCommentService(
  db: DB,
  mapper?: TemplateMap
): CommentQuery<Comment, CommentFilter> {
  const query = useQuery('locationcomments', mapper, commentModel, true);
  const builder = new SearchBuilder<Comment, CommentFilter>(
    db.query,
    'locationcomments',
    commentModel,
    db.driver,
    query
  );
  const rateCommentRepository = new SqlCommentRepository<Comment>(
    db,
    'locationcomments',
    commentModel,
    'locationrates',
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

export function useLocationRateCommentController(
  log: Log,
  db: DB,
  mapper?: TemplateMap
): RateCommentController<Comment> {
  return new RateCommentController(
    log,
    useLocationRateCommentService(db, mapper)
  );
}

export function generate(): string {
  return shortid.generate();
}
