import { Log, ViewManager } from 'onecore';
import { DB, postgres, SearchBuilder } from 'query-core';
import { TemplateMap } from 'query-mappers';
import { buildQuery } from './query';
import { SqlUserRepository } from './sql-user-repository';
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
  const repository = new SqlUserRepository(db);
  const service = new UserManager(repository);
  return new UserController(log, builder.search, service);
}
