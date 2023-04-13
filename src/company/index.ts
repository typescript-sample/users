import { buildId, QueryController } from 'express-ext'
import { Log, Search, ViewSearchManager } from 'onecore'
import { buildToSave, useUrlQuery } from 'pg-extension'
import { DB, Repository, SearchBuilder, SqlLoadRepository } from 'query-core'
import { TemplateMap, useQuery } from 'query-mappers'
import { Info, infoModel, Rates, RatesService, RatesValidator } from 'rate-core'
import { SqlRatesRepository } from 'rate-query'
import { Comment, CommentFilter, CommentValidator, ReactionService } from 'review-reaction'
import { RateCommentController, RateController, ReactionController } from 'review-reaction-express'
import { commentModel, CommentQuery, InfoRepository, rateReactionModel, SqlCommentRepository, SqlInfoRepository, SqlReactionRepository } from 'review-reaction-query'
import shortid from 'shortid'
import { check } from 'xvalidators'
import { RateCriteria, RateCriteriaFilter, rateCriteriaModel, RateFullInfo } from './company'
import { Company, CompanyFilter, companyModel, CompanyQuery, CompanyRepository } from './company'
import { Request, Response } from 'express'

const generate = () => shortid.generate()

class CompanyRepositoryImpl extends Repository<Company, string> implements CompanyRepository {
  getAllByUser = (userId: string): Promise<Company[]> => this.query(
    `
      select c.*
      from company c
        join company_users cu on c.id  = cu.company_id and cu.user_id = ${this.param(1)}
    `,
    [userId],
    this.map
  ) // End of getAllByUser
} // End of CompanyRepositoryImpl

class CompanyService extends ViewSearchManager<Company, string, CompanyFilter> implements CompanyQuery {
  constructor(search: Search<Company, CompanyFilter>, protected repository: CompanyRepository, private infoRepository: InfoRepository<Info>) {
    super(search, repository)
  } // End of constructor

  async load(id: string): Promise<Company | null> {
    const company = await this.repository.load(id)

    if (!company) {
      return null
    }

    const info = await this.infoRepository.load(id)

    if (info) {
      delete (info as any)['id']
      delete (info as any)['count']
      delete (info as any)['score']
      company.info = info
    }

    return company
  } // End of load

  getAllByUser = (userId: string): Promise<Company[]> => this.repository.getAllByUser(userId)
} // End of CompanyService

export class CompanyController extends QueryController<Company, string, CompanyFilter> {
  constructor(log: Log, public service: CompanyQuery) {
    super(log, service)
    this.getAllByUser = this.getAllByUser.bind(this)
  } // End of constructor

  async getAllByUser(req: Request, res: Response) {
    const userId = buildId<string>(req)

    if (!userId || userId.length === 0) {
      res.status(400).send('The user ID cannot be null or empty')
      return
    }

    try {
      res.status(200).json(await this.service.getAllByUser(userId) || []).end()
    }
    catch (err) {
      this.log(typeof err === 'string' ? err : JSON.stringify(err))
      res.status(500).end('Internal Server Error')
    }
  } // End of getByUser
} // End of CompanyController

export const useCompanyController = (log: Log, db: DB, mapper?: TemplateMap) => new CompanyController(
  log,
  new CompanyService(
    new SearchBuilder<Company, CompanyFilter>(
      db.query,
      'company',
      companyModel,
      db.driver,
      useQuery('company', mapper, companyModel, true)
    ).search,
    new CompanyRepositoryImpl(db, 'company', companyModel),
    new SqlInfoRepository<Info>(db, 'companyratefullinfo', infoModel, buildToSave)
  )
) // End of useCompanyController

export function useCompanyRateController(log: Log, db: DB, mapper?: TemplateMap) {
  const rateRepository = new SqlRatesRepository<Rates>(db, 'companyrate', 'companyratefullinfo', ['companyrateinfo01', 'companyrateinfo02', 'companyrateinfo03', 'companyrateinfo04', 'companyrateinfo05'], rateCriteriaModel, buildToSave, 5, 'rate', 'count', 'score', 'author', 'id')
  const infoRepository = new SqlInfoRepository<RateFullInfo>(db, 'companyratefullinfo', infoModel, buildToSave)
  const rateValidator = new RatesValidator(rateCriteriaModel, check, 5, 5)
  const rateService = new RatesService(rateRepository, infoRepository)

  return new RateController<Rates>(log, rateService.rate, rateValidator.validate, 'author', 'id')
} // End of useCompanyRateController

export function useCompanyRateReactionController(log: Log, db: DB, mapper?: TemplateMap) {
  const query = useQuery('companyrate', mapper, rateCriteriaModel, true)
  const builder = new SearchBuilder<RateCriteria, RateCriteriaFilter>(db.query, 'companyrate', rateCriteriaModel, db.driver, query)
  const rateRepository = new SqlLoadRepository<RateCriteria, string, string>(db.query, 'companyrate', rateCriteriaModel, db.param, 'id', 'author')
  const rateReactionRepository = new SqlReactionRepository(db, 'companyratereaction', rateReactionModel, 'companyrate', 'usefulCount', 'author', 'id')
  const rateCommentRepository = new SqlCommentRepository<Comment>(db, 'companyratecomment', commentModel, 'companyrate', 'id', 'author', 'replyCount', 'author', 'id')
  const service = new ReactionService<RateCriteria, RateCriteriaFilter>(builder.search, rateRepository, rateReactionRepository, rateCommentRepository)
  const commentValidator = new CommentValidator(commentModel, check)

  return new ReactionController<RateCriteria, RateCriteriaFilter, Comment>(log, service, commentValidator, ['time'], ['rates', 'usefulCount', 'replyCount', 'count', 'score'], generate, 'commentId', 'userId', 'author', 'id')
} // End of useCompanyRateReactionController

export function useCompanyRateCommentService(db: DB, mapper?: TemplateMap) {
  const query = useQuery('companyratecomment', mapper, commentModel, true)
  const builder = new SearchBuilder<Comment, CommentFilter>(db.query, 'companyratecomment', commentModel, db.driver, query)
  const rateCommentRepository = new SqlCommentRepository<Comment>(db, 'companyratecomment', commentModel, 'companyrate', 'id', 'author', 'replyCount', 'author', 'time', 'id')
  const queryUrl = useUrlQuery<string>(db.query, 'users', 'imageURL', 'id')

  return new CommentQuery<Comment, CommentFilter>(builder.search, rateCommentRepository, queryUrl)
} // End of useCompanyRateCommentService

export function useCompanyRateCommentController(log: Log, db: DB, mapper?: TemplateMap) {
  const query = useQuery('companyratecomment', mapper, commentModel, true)
  const builder = new SearchBuilder<Comment, CommentFilter>(db.query, 'companyratecomment', commentModel, db.driver, query)
  const rateCommentRepository = new SqlCommentRepository<Comment>(db, 'companyratecomment', commentModel, 'companyrate', 'id', 'author', 'replyCount', 'author', 'time', 'id')
  const queryUrl = useUrlQuery<string>(db.query, 'users', 'imageURL', 'id')
  const service = new CommentQuery(builder.search, rateCommentRepository, queryUrl)

  return new RateCommentController<Comment>(log, service)
} // End of useCompanyRateCommentController