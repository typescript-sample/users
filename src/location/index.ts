import { FollowController } from 'express-ext';
import { SavedController } from 'express-ext';
import { QueryController } from 'express-ext';
import { Delete, StorageRepository } from 'google-storage';
import { GenericSearchStorageService, ModelConf, StorageConf, UploadInfo } from 'one-storage';
import { BuildUrl, Generate, Log, SavedService, Search, ViewSearchManager } from 'onecore';
import { ArrayRepository, buildToSave, FollowService, useUrlQuery } from 'pg-extension';
import { DB, postgres, QueryRepository, Repository, SearchBuilder, SqlLoadRepository } from 'query-core';
import { TemplateMap, useQuery } from 'query-mappers';
import {
  Info,
  infoModel,
  Rate,
  RateFilter,
  rateModel,
  RateService,
  RateValidator,
} from '../rate-core';
import { SqlRateRepository } from 'rate-query';
import {
  Comment,
  CommentFilter,
  CommentValidator,
  ReactionService,
} from '../review-reaction';
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
} from '../review-reaction-query';
import { CommentQuery } from 'review-reaction-query';
import shortid from 'shortid';
import { UploadController, UploadService } from 'upload-express';
import { check } from 'xvalidators';
import {
  LocationInfomation,
  LocationInfomationFilter,
  locationInfomationModel,
  LocationInfomationQuery,
  LocationInfomationRepository
} from './location';
import {
  Location,
  LocationFilter,
  locationModel,
  LocationQuery,
  LocationRepository,
} from './location';
import { useInfoQuery } from '../rate-user-query';
import { CommentReactionClient, CommentReactionController, commentReactionModel, CommentThread, CommentThreadClient, CommentThreadController, CommentThreadFilter, commentThreadModel, commentThreadReplyModel, CommentThreadRepository, CommentThreadValidator, SqlCommentReactionRepository, SqlCommentThreadReplyRepository, SqlCommentThreadRepository } from '../comment-thread';

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
            location.info = info;
          }
          return location;
        });
      }
    });
  }
}

export class LocationUploadService extends GenericSearchStorageService<Location, string, LocationFilter> implements UploadService {
  constructor(
    search: Search<Location, LocationFilter>,
    repository: LocationRepository,
    storage: StorageRepository,
    deleteFile: Delete,
    generateId: Generate,
    buildUrl: BuildUrl,
    sizesCover: number[],
    sizesImage: number[],
    config?: StorageConf,
    model?: ModelConf
  ) {
    super(search, repository, storage, deleteFile, generateId, buildUrl, sizesCover, sizesImage, config, model);
  }
  async getGalllery(id: string): Promise<UploadInfo[]> {
    return this.repository.load(id).then((item) => {
      if (item) {
        return (item as any)[this.model.gallery];
      }
      return [];
    });
  }
}


export class LocationController extends QueryController<Location, string, LocationFilter> {
  constructor(log: Log, public locationService: LocationQuery) {
    super(log, locationService);
  }
}
export class LocationInfomationController extends QueryController<LocationInfomation, string, LocationInfomationFilter> {
  constructor(log: Log, service: LocationInfomationQuery) {
    super(log, service);
  }
}

export function useLocationController(log: Log, db: DB, mapper?: TemplateMap): QueryController<Location, string, LocationFilter> {
  const query = useQuery('location', mapper, locationModel, true);
  const builder = new SearchBuilder<Location, LocationFilter>(db.query, 'location', locationModel, db.driver, query);
  const repository = new Repository<Location, string>(db, 'location', locationModel);
  const infoRepository = new SqlInfoRepository<Info>(db, 'locationinfo', infoModel, buildToSave);
  const service = new LocationService(builder.search, repository, infoRepository);
  return new QueryController<Location, string, LocationFilter>(log, service);
}

export function useLocationRateController(log: Log, db: DB, mapper?: TemplateMap): RateController<Rate> {
  const rateRepository = new SqlRateRepository<Rate>(db, 'locationrate', rateModel, buildToSave, 5, 'locationinfo', 'rate', 'count', 'score', 'author', 'id');
  const infoRepository = new SqlInfoRepository<Info>(db, 'locationinfo', infoModel, buildToSave);
  const rateValidator = new RateValidator(rateModel, check, 5);
  const rateService = new RateService(rateRepository, infoRepository);
  return new RateController(log, rateService.rate, rateValidator.validate, 'author', 'id');
}

export function useLocationReactionService(db: DB, mapper?: TemplateMap): ReactionService<Rate, RateFilter> {
  const query = useQuery('locationrate', mapper, rateModel, true);
  const builder = new SearchBuilder<Rate, RateFilter>(db.query, 'locationrate', rateModel, db.driver, query);
  const rateRepository = new SqlLoadRepository<Rate, string, string>(db.query, 'locationrate', rateModel, db.param, 'id', 'author');
  const rateReactionRepository = new SqlReactionRepository(db, 'locationratereaction', rateReactionModel, 'locationrate', 'usefulCount', 'author', 'id');
  const rateCommentRepository = new SqlCommentRepository<Comment>(db, 'locationcomment', commentModel, 'locationrate', 'id', 'author', 'replyCount', 'author', 'id');
  const queryInfo = useInfoQuery<string>(db.query, 'users', 'imageURL', 'id', 'username', 'displayname');
  return new ReactionService<Rate, RateFilter>(builder.search, rateRepository, rateReactionRepository, rateCommentRepository, queryInfo);
}

export function useLocationReactionController(log: Log, db: DB, mapper?: TemplateMap): ReactionController<Rate, RateFilter, Comment> {
  const commentValidator = new CommentValidator(commentModel, check);
  return new ReactionController(log, useLocationReactionService(db, mapper), commentValidator,
    ['time'], ['rate', 'usefulCount', 'replyCount', 'count', 'score'],
    generate, 'commentId', 'userId', 'author', 'id');
}

export function useLocationRateCommentService(db: DB, mapper?: TemplateMap): CommentQuery<Comment, CommentFilter> {
  const query = useQuery('locationcomment', mapper, commentModel, true);
  const builder = new SearchBuilder<Comment, CommentFilter>(db.query, 'locationcomment', commentModel, db.driver, query);
  const rateCommentRepository = new SqlCommentRepository<Comment>(db, 'locationcomment', commentModel, 'locationrate', 'id', 'author', 'replyCount', 'author', 'time', 'id');
  const queryInfo = useInfoQuery<string>(db.query, 'users', 'imageURL', 'id', 'username', 'displayname');
  return new CommentQuery(builder.search, rateCommentRepository, queryInfo);
}

export function useLocationRateCommentController(log: Log, db: DB, mapper?: TemplateMap): RateCommentController<Comment> {
  return new RateCommentController(log, useLocationRateCommentService(db, mapper));
}

export function generate(): string {
  return shortid.generate();
}

export function useLocationFollowController(log: Log, db: DB): FollowController {
  const service = new FollowService<string>(
    db.execBatch,
    'locationfollowing', 'id', 'following',
    'locationfollower', 'id', 'follower',
    'locationinfomation', 'id', 'followerCount', 'followingCount');
  return new FollowController(log, service, 'id', 'target');
}
export function useSavedLocationController(log: Log, db: DB): SavedController<Location> {
  const savedRepository = new ArrayRepository<string, string>(db.query, db.exec, 'savedlocation', 'items', 'id');
  const repository = new QueryRepository<Location, string>(db, 'location', locationModel);
  const service = new SavedService<string, Location>(savedRepository, repository.query, 50);
  return new SavedController<Location>(log, service, 'itemId', 'id');
}

export class LocationInfomationService extends ViewSearchManager<LocationInfomation, string, LocationInfomationFilter> implements LocationInfomationQuery {
  constructor(search: Search<LocationInfomation, LocationInfomationFilter>, repository: LocationInfomationRepository) {
    super(search, repository);
  }
}
export function useLocationInfomationController(log: Log, db: DB, mapper?: TemplateMap): LocationInfomationController {
  const query = useQuery('locationinfomation', mapper, locationInfomationModel, true);
  const builder = new SearchBuilder<LocationInfomation, LocationInfomationFilter>(db.query, 'locationinfomation', locationInfomationModel, db.driver, query);
  const repository = new Repository<LocationInfomation, string>(db, 'locationinfomation', locationInfomationModel);
  const service = new LocationInfomationService(builder.search, repository);
  return new LocationInfomationController(log, service);
}

export function useLocationUploadController(log: Log, db: DB, storage: StorageRepository, deleteFile: Delete, generateId: Generate, buildUrl: BuildUrl, sizesCover: number[],
  sizesImage: number[], config?: StorageConf, model?: ModelConf, mapper?: TemplateMap): UploadController {
  const queryItems = useQuery('item', mapper, locationModel, true);
  const builder = new SearchBuilder<Location, LocationFilter>(db.query, 'item', locationModel, postgres, queryItems);
  const repository = new Repository<Location, string>(db, 'item', locationModel);
  const service = new LocationUploadService(builder.search, repository, storage, deleteFile, generateId, buildUrl, sizesCover, sizesImage, config, model);
  return new UploadController(log, service, generateId, sizesCover, sizesImage);
}

export function useLocationCommentThreadController(log: Log, db: DB, mapper?: TemplateMap): CommentThreadController<CommentThread> {
  const commentThreadRepository = new SqlCommentThreadRepository(db, "locationcommentthread", commentThreadModel, "commentid", "id", "author", "comment", "time", "locationreplycomment", "commentId", "CommentThreadId", "locationcommentthreadinfo", "commentId", "locationreplycommentinfo", "commentId", "locationcommentthreadreaction", "commentId", "locationreplycommentreaction", "commentId")
  const commentThreadReplyRepository = new SqlCommentThreadReplyRepository(db, 'locationreplycomment', commentThreadReplyModel, "commentId", "author", "commentThreadId", "userId", "locationcommentthreadinfo", "commentId", "replyCount", "usefulCount",
    "users", "id", "username", "imageurl", "locationreplycommentinfo", "commentId", "usefulCount", "locationreplycommentreaction", "commentId", "reaction")
  const commentThreadValidator = new CommentThreadValidator(commentThreadModel, check)
  const query = useQuery('locationcommentthread', mapper, commentThreadModel, true)
  const queryInfo = useInfoQuery<string>(db.query, 'users', 'imageURL', 'id', 'username', 'displayname');
  const builder = new SearchBuilder<CommentThread, CommentThreadFilter>(db.query, 'locationcommentthread', commentThreadModel, db.driver, query);
  const commentThreadService = new CommentThreadClient(builder.search, commentThreadRepository, commentThreadReplyRepository, queryInfo)
  return new CommentThreadController(log, commentThreadService, commentThreadValidator, "commentId", "id", "author", "userId", "comment", "commentThreadId", "parent", generate, "locationreplycomment", "commentId", "comment")
}

export function useLocationCommentThreadReactionController(log: Log, db: DB, mapper?: TemplateMap) {
  const commentReactionRepository = new SqlCommentReactionRepository(db, "locationcommentthreadreaction", commentReactionModel, "locationcommentthreadinfo", "usefulcount", "commentId", "userId", "author", "commentId")
  const commentReactionService = new CommentReactionClient(commentReactionRepository)
  return new CommentReactionController(log, commentReactionService, "commentId", "author", "userId")
}

export function useLocationCommentReactionController(log: Log, db: DB, mapper?: TemplateMap) {
  const commentReactionRepository = new SqlCommentReactionRepository(db, "locationreplycommentreaction", commentReactionModel, "locationreplycommentinfo", "usefulcount", "commentId", "userId", "author", "commentId")
  const commentReactionService = new CommentReactionClient(commentReactionRepository)
  return new CommentReactionController(log, commentReactionService, "commentId", "author", "userId")
}
