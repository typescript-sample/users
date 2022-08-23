import { Log, ViewManager, ViewSearchManager, Search } from 'onecore';
import { DB, postgres, Repository, SearchBuilder, SqlLoadRepository } from 'query-core';
import { TemplateMap, useQuery } from 'query-mappers';
import { buildQuery } from './query';
import {
  User,
  UserFilter,
  userModel,
  UserRepository,
  UserService,
  UserInfo,
  UserInfoQuery,
  UserInfoRepository,
  userInfoModel,
  UserInfoFilter
} from './user';
import { buildToSave, FollowService } from 'pg-extension';
import { FollowController } from 'express-ext';
export * from './user';
import { LoadSearchHandler,QueryController } from 'express-ext';
import { Comment, commentModel, CommentQuery, InfoRepository, rateReactionModel, SqlCommentRepository, SqlInfoRepository, SqlReactionRepository } from 'review-reaction-query';
import { Info10, info10Model, Rate, RateFilter, rateModel, RateService, RateValidator } from 'rate-core';
import { RateCommentController, RateController, ReactionController } from 'review-reaction-express';
import { SqlRateRepository } from 'rate-query';
import { check } from 'xvalidators';
import { CommentFilter, CommentValidator, ReactionService } from 'review-reaction';
import shortid from 'shortid';

export class UserController extends QueryController<User, string, UserFilter> {
  constructor(log: Log, service: UserService) {
    super(log, service);
  }
}

export class UserInFoController extends QueryController<UserInfo, string,UserInfoFilter> {
  constructor(log: Log, service: UserInfoQuery) {
    super(log, service);
  }
}

export class UserManager
  extends ViewSearchManager<User, string,UserFilter>
  implements UserService {
  constructor(
    search: Search<User, UserFilter>,
    protected repository: UserRepository,
    private infoRepository: InfoRepository<Info10>
    ) {
    super(search,repository);
  }
  load(id: string): Promise<User | null> {
    return this.repository.load(id).then((user) => {
      if (!user) {
        return null;
      } else {
        return this.infoRepository.load(id).then((info) => {
          if (info) {
            delete (info as any)['id'];
            user.info = info;
          }
          return user;
        });
      }
    });
  }
}

export function useUserController(log: Log, db: DB, mapper?: TemplateMap): UserController {
  const query = useQuery('users', mapper, userModel, true);
  // const builder = new SearchBuilder<User, UserFilter>(
  //   db.query,
  //   'users',
  //   userModel,
  //   postgres,
  //   buildQuery
  // );
  const builder = new SearchBuilder<User, UserFilter>(db.query, 'users', userModel, db.driver, query);
  const repository = new Repository<User, string>(db, 'users', userModel);
  const infoRepository = new SqlInfoRepository<Info10>(db, 'userrateinfo', info10Model, buildToSave);
  const service = new UserManager(builder.search, repository,infoRepository);
  return new UserController(log, service);
}
//-----rate----------------------------
export function useUserRateController(log: Log, db: DB, mapper?: TemplateMap): RateController<Rate> {
  const rateRepository = new SqlRateRepository<Rate>(db, 'userrate', rateModel, buildToSave, 10, 'userrateinfo', 'rate', 'count', 'score', 'author', 'id');
  const infoRepository = new SqlInfoRepository<Info10>(db, 'userrateinfo', info10Model, buildToSave);
  const rateValidator = new RateValidator(rateModel, check, 10);
  const rateService = new RateService(rateRepository, infoRepository);
  return new RateController(log, rateService.rate, rateValidator.validate, 'author', 'id');
}

export function useUserReactionController(log: Log, db: DB, mapper?: TemplateMap): ReactionController<Rate, RateFilter, Comment> {
  const query = useQuery('userrate', mapper, rateModel, true);
  const builder = new SearchBuilder<Rate, RateFilter>(db.query, 'userrate', rateModel, db.driver, query);
  const rateRepository = new SqlLoadRepository<Rate, string, string>(db.query, 'userrate', rateModel, db.param, 'id', 'author');
  const rateReactionRepository = new SqlReactionRepository(db, 'userratereaction', rateReactionModel, 'userrate', 'usefulCount', 'author', 'id');
  const rateCommentRepository = new SqlCommentRepository<Comment>(db, 'userratecomment', commentModel, 'userrate', 'id', 'author', 'replyCount', 'author', 'time', 'id');
  const service = new ReactionService<Rate, RateFilter>(builder.search, rateRepository, rateReactionRepository, rateCommentRepository);
  const commentValidator = new CommentValidator(commentModel, check);
  return new ReactionController(log, service, commentValidator, ['time'], ['rate', 'usefulCount', 'replyCount', 'count', 'score'],
    generate, 'commentId', 'userId', 'author', 'id');
}

export function useUserRateCommentController(log: Log, db: DB, mapper?: TemplateMap): RateCommentController<Comment> {
  const query = useQuery('userratecomment', mapper, commentModel, true);
  const builder = new SearchBuilder<Comment, CommentFilter>(db.query, 'userratecomment', commentModel, db.driver, query);
  const rateCommentRepository = new SqlCommentRepository<Comment>(db, 'userratecomment', commentModel, 'userrate', 'id', 'author', 'replyCount', 'author', 'time', 'id');
  const service = new CommentQuery<Comment, CommentFilter>(builder.search, rateCommentRepository);
  return new RateCommentController(log, service);
}

export function generate(): string {
  return shortid.generate();
}

//--follow------------------------------------
export function useUserFollowController(log: Log, db: DB): FollowController {

  const service = new FollowService<string>(
    db.execBatch,
    'userfollowing', 'id', 'following',
    'userfollower', 'id', 'follower',
    'userinfo', 'id', 'followerCount', 'followingCount');
  return new FollowController(log, service, 'id', 'target');
}


export class UserInfoService extends ViewSearchManager<UserInfo, string, UserInfoFilter> implements UserInfoQuery {
  constructor(search: Search<UserInfo, UserInfoFilter>, repository: UserInfoRepository) {
    super(search, repository);
  }
}
export function useUserInfoController(log: Log, db: DB, mapper?: TemplateMap): UserInFoController {
  const query = useQuery('userinfo', mapper, userInfoModel, true);
  const builder = new SearchBuilder<UserInfo, UserInfoFilter>(db.query, 'userinfo', userInfoModel, db.driver, query);
  const repository = new Repository<UserInfo, string>(db, 'userinfo', userInfoModel);
  const service = new UserInfoService(builder.search, repository);
  return new UserInFoController(log, service);
}