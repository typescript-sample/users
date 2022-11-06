import { FollowController, QueryController, UserReactionController } from 'express-ext'
import { Log, Search, ViewSearchManager } from 'onecore'
import { buildToSave, FollowService, ReactService } from 'pg-extension'
import { DB, Repository, SearchBuilder, SqlLoadRepository } from 'query-core'
import { TemplateMap, useQuery } from 'query-mappers'
import { Info10, info10Model, Rate, RateFilter, rateModel, RateService, RateValidator } from 'rate-core'
import { SqlRateRepository } from 'rate-query'
import { CommentFilter, CommentValidator, ReactionService } from 'review-reaction'
import { RateCommentController, RateController, ReactionController } from 'review-reaction-express'
import { Comment, commentModel, CommentQuery, InfoRepository, rateReactionModel, SqlCommentRepository, SqlInfoRepository, SqlReactionRepository } from 'review-reaction-query'
import shortid from 'shortid'
import { check } from 'xvalidators'
import { User, UserFilter, UserInfo, UserInfoFilter, userInfoModel, UserInfoQuery, UserInfoRepository, userModel, UserRepository, UserService } from './user'
import {Request, Response} from 'express'

export * from './user'

export class UserManager extends ViewSearchManager<User, string, UserFilter> implements UserService {
  constructor(search: Search<User, UserFilter>, protected repository: UserRepository, private infoRepository: InfoRepository<Info10>) {
    super(search, repository)
  }

  async load(id: string): Promise<User | null> {
    const user = await this.repository.load(id)

    if (!user) {
      return null
    }

    const info = await this.infoRepository.load(id)

    if (info) {
      delete (info as any)['id'];
      user.info = info
    }

    return user
  }

  getUsersByCompany = (companyId: string): Promise<User[]> => this.repository.getUsersByCompany(companyId)
} // End of UserManager

export class UserRepositoryImpl extends Repository<User, string> implements UserRepository {
  getUsersByCompany = (companyId: string): Promise<User[]> => this.query(
    `
      select users.*
      from users
        join company_users rel on users.id = rel.user_id
      where
        rel.company_id = ${this.param(1)}
    `,
    [companyId],
    this.map
  );
} // End of UserRepositoryImpl

export class UserController extends QueryController<User, string, UserFilter> {
  constructor(log: Log, private service: UserService) {
    super(log, service)
    this.getUsersByCompany = this.getUsersByCompany.bind(this)
  }

  getUsersByCompany(req: Request, res: Response) {
    const companyId = req.params['companyId']

    if (!companyId || companyId.length === 0) {
      res.status(400).send('The company ID cannot be empty')
      return
    }

    this.service
        .getUsersByCompany(companyId)
        .then((rsl) => res.status(200).json(rsl || []).end())
        .catch((err) => {
          this.log(typeof err === 'string' ? err : JSON.stringify(err))
          res.status(500).end('Internal Server Error')
        })
  }
} // End of UserController

export class UserInfoService extends ViewSearchManager<UserInfo, string, UserInfoFilter> implements UserInfoQuery {
  constructor(search: Search<UserInfo, UserInfoFilter>, repository: UserInfoRepository) {
    super(search, repository)
  }
} // End of UserInfoService

export class UserInFoController extends QueryController<UserInfo, string, UserInfoFilter> {
  constructor(log: Log, service: UserInfoQuery) {
    super(log, service);
  }
} // End of UserInFoController

export function generate(): string {
  return shortid.generate()
}

export function useUserController(log: Log, db: DB, mapper?: TemplateMap): UserController {
  const query = useQuery('users', mapper, userModel, true)
  const builder = new SearchBuilder<User, UserFilter>(db.query, 'users', userModel, db.driver, query)
  const repository = new UserRepositoryImpl(db, 'users', userModel)
  const infoRepository = new SqlInfoRepository<Info10>(db, 'userrateinfo', info10Model, buildToSave)
  const service = new UserManager(builder.search, repository, infoRepository)
  return new UserController(log, service)
}

export function useUserRateController(log: Log, db: DB, mapper?: TemplateMap): RateController<Rate> {
  const rateRepository = new SqlRateRepository<Rate>(db, 'userrate', rateModel, buildToSave, 10, 'userrateinfo', 'rate', 'count', 'score', 'author', 'id')
  const infoRepository = new SqlInfoRepository<Info10>(db, 'userrateinfo', info10Model, buildToSave)
  const rateValidator = new RateValidator(rateModel, check, 10)
  const rateService = new RateService(rateRepository, infoRepository)
  return new RateController(log, rateService.rate, rateValidator.validate, 'author', 'id')
}

export function useUserReactionController(log: Log, db: DB, mapper?: TemplateMap): ReactionController<Rate, RateFilter, Comment> {
  const query = useQuery('userrate', mapper, rateModel, true)
  const builder = new SearchBuilder<Rate, RateFilter>(db.query, 'userrate', rateModel, db.driver, query)
  const rateRepository = new SqlLoadRepository<Rate, string, string>(db.query, 'userrate', rateModel, db.param, 'id', 'author')
  const rateReactionRepository = new SqlReactionRepository(db, 'userratereaction', rateReactionModel, 'userrate', 'usefulCount', 'author', 'id')
  const rateCommentRepository = new SqlCommentRepository<Comment>(db, 'userratecomment', commentModel, 'userrate', 'id', 'author', 'replyCount', 'author', 'time', 'id')
  const service = new ReactionService<Rate, RateFilter>(builder.search, rateRepository, rateReactionRepository, rateCommentRepository)
  const commentValidator = new CommentValidator(commentModel, check)
  return new ReactionController(log, service, commentValidator, ['time'], ['rate', 'usefulCount', 'replyCount', 'count', 'score'], generate, 'commentId', 'userId', 'author', 'id')
}

export function useUserRateCommentController(log: Log, db: DB, mapper?: TemplateMap): RateCommentController<Comment> {
  const query = useQuery('userratecomment', mapper, commentModel, true)
  const builder = new SearchBuilder<Comment, CommentFilter>(db.query, 'userratecomment', commentModel, db.driver, query)
  const rateCommentRepository = new SqlCommentRepository<Comment>(db, 'userratecomment', commentModel, 'userrate', 'id', 'author', 'replyCount', 'author', 'time', 'id')
  const service = new CommentQuery<Comment, CommentFilter>(builder.search, rateCommentRepository)
  return new RateCommentController(log, service)
}

export function useReactionController(log: Log, db: DB): UserReactionController {
  const service = new ReactService<string>(db, 'userreaction', 'id', 'author', 'reaction', 'level', 'count', 'userinfo', 'id', 'reactioncount')
  return new UserReactionController(log, service,  'author', 'id', 'reaction')
}

export function useUserFollowController(log: Log, db: DB): FollowController {
  const service = new FollowService<string>(db.execBatch, 'userfollowing', 'id', 'following', 'userfollower', 'id', 'follower', 'userinfo', 'id', 'followerCount', 'followingCount')
  return new FollowController(log, service, 'id', 'target')
}

export function useUserInfoController(log: Log, db: DB, mapper?: TemplateMap): UserInFoController {
  const query = useQuery('userinfo', mapper, userInfoModel, true)
  const builder = new SearchBuilder<UserInfo, UserInfoFilter>(db.query, 'userinfo', userInfoModel, db.driver, query)
  const repository = new Repository<UserInfo, string>(db, 'userinfo', userInfoModel)
  const service = new UserInfoService(builder.search, repository)
  return new UserInFoController(log, service)
}
