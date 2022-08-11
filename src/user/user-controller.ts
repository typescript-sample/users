import { LoadSearchHandler,QueryController } from 'express-ext';
import { Log, Search } from 'onecore';
import { User, UserFilter, UserService,UserInfo,UserInfoQuery,UserInfoFilter } from './user';

export class UserController extends LoadSearchHandler<User, string, UserFilter> {
  constructor(log: Log, find: Search<User, UserFilter>, service: UserService) {
    super(log, find, service);
  }
}

export class UserInFoController extends QueryController<UserInfo, string,UserInfoFilter> {
  constructor(log: Log, service: UserInfoQuery) {
    super(log, service);
  }
}