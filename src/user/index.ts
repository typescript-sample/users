import { FollowRepository } from '../follow';
import { FollowController } from '../following-controller';
import { Log, ViewManager } from 'onecore';
import { DB, postgres, Repository, SearchBuilder } from 'query-core';
import { TemplateMap } from 'query-mappers';
import { buildQuery } from './query';
import {
  User,
  UserFilter,
  userModel,
  UserRepository,
  UserService,
} from './user';
import { UserController } from './user-controller';
export * from './user';
export * from './user-controller';

export class UserManager
  extends ViewManager<User, string>
  implements UserService {
  constructor(repository: UserRepository) {
    super(repository);
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

  const service = new FollowRepository<string>(
    db.execBatch,
    'userfollowing', 'id', 'following',
    'userfollower', 'id', 'follower',
    'userinfo', 'id', 'followerCount', 'followingCount');
  return new FollowController(log, service, 'id', 'target');
}

