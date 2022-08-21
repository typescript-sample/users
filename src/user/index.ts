import { FollowController } from 'express-ext';
import { LoadSearchHandler, QueryController } from 'express-ext';
import { Log, Search, ViewManager, ViewSearchManager } from 'onecore';
import { FollowService } from 'pg-extension';
import { DB, postgres, Repository, SearchBuilder } from 'query-core';
import { TemplateMap, useQuery } from 'query-mappers';
import { buildQuery } from './query';
import {
  User,
  UserFilter,
  UserInfo,
  UserInfoFilter,
  userInfoModel,
  UserInfoQuery,
  UserInfoRepository,
  userModel,
  UserRepository,
  UserService
} from './user';

export * from './user';

export class UserManager
  extends ViewManager<User, string>
  implements UserService {
  constructor(repository: UserRepository) {
    super(repository);
  }
}

export class UserController extends LoadSearchHandler<User, string, UserFilter> {
  constructor(log: Log, find: Search<User, UserFilter>, service: UserService) {
    super(log, find, service);
  }
}
export function useUserController(log: Log, db: DB, mapper?: TemplateMap): UserController {
  // const query = useQuery('users', mapper, userModel, true);
  const builder = new SearchBuilder<User, UserFilter>(
    db.query,
    'users',
    userModel,
    postgres,
    buildQuery
  );
  const repository = new Repository<User, string>(db, 'users', userModel);
  const service = new UserManager(repository);
  return new UserController(log, builder.search, service);
}

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
export class UserInFoController extends QueryController<UserInfo, string, UserInfoFilter> {
  constructor(log: Log, service: UserInfoQuery) {
    super(log, service);
  }
}
export function useUserInfoController(log: Log, db: DB, mapper?: TemplateMap): UserInFoController {
  const query = useQuery('userinfo', mapper, userInfoModel, true);
  const builder = new SearchBuilder<UserInfo, UserInfoFilter>(db.query, 'userinfo', userInfoModel, db.driver, query);
  const repository = new Repository<UserInfo, string>(db, 'userinfo', userInfoModel);
  const service = new UserInfoService(builder.search, repository);
  return new UserInFoController(log, service);
}
