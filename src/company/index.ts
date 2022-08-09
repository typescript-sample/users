import { Log, Manager, Search,ViewSearchManager } from 'onecore';
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
  Company,
  CompanyFilter,
  companyModel,
  CompanyRepository,
  CompanyQuery,
} from './company';
import { CompanyController } from './company-controller';

export * from './company-controller';
export { CompanyController };

export class CompanyService
  extends ViewSearchManager<Company, string, CompanyFilter>
  implements CompanyQuery {
  constructor(
    search: Search<Company, CompanyFilter>,
    protected repository: CompanyRepository,
    private infoRepository: InfoRepository<Info>
  ) {
    super(search, repository);
  }
  load(id: string): Promise<Company | null> {
    return this.repository.load(id).then((company) => {
      if (!company) {
        return null;
      } else {
        return this.infoRepository.load(id).then((info) => {
          if (info) {
            delete (info as any)['id'];
            delete (info as any)['count'];
            delete (info as any)['score'];
            company.info = info;
          }
          console.log({ company });

          return company;
        });
      }
    });
  }
}

export function useCompanyService(
  db: DB,
  mapper?: TemplateMap
): CompanyQuery {
  const query = useQuery('companies', mapper, companyModel, true);
  const builder = new SearchBuilder<Company, CompanyFilter>(
    db.query,
    'companies',
    companyModel,
    db.driver,
    query
  );
  const repository = new Repository<Company, string>(db, 'companies', companyModel);
  const infoRepository = new SqlInfoRepository<Info>(
    db,
    'info_company',
    infoModel,
    buildToSave
  );
  return new CompanyService(builder.search, repository, infoRepository);
}

export function useCompanyController( log: Log, db: DB, mapper?: TemplateMap ): CompanyController {
  return new CompanyController(log, useCompanyService(db, mapper));
}

// Rate
export function useCompanyRateController(
  log: Log,
  db: DB,
  mapper?: TemplateMap
): RateController<Rate> {
  const rateRepository = new SqlRateRepository<Rate>(
    db,
    'company_rates',
    rateModel,
    buildToSave,
    5,
    'info_company',
    'rate',
    'count',
    'score',
    'author',
    'id'
  );
  const infoRepository = new SqlInfoRepository<Info>(
    db,
    'info_company',
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

// Reaction
export function useCompanyReactionService(
  db: DB,
  mapper?: TemplateMap
): ReactionService<Rate, RateFilter> {
  const query = useQuery('rates_company', mapper, rateModel, true);
  const builder = new SearchBuilder<Rate, RateFilter>(
    db.query,
    'rates_company',
    rateModel,
    db.driver,
    query
  );
  const rateRepository = new SqlLoadRepository<Rate, string, string>(
    db.query,
    'rates_company',
    rateModel,
    db.param,
    'id',
    'author'
  );
  const rateReactionRepository = new SqlReactionRepository(
    db,
    'ratereaction_company',
    rateReactionModel,
    'rates',
    'usefulCount',
    'author',
    'id'
  );
  const rateCommentRepository = new SqlCommentRepository<Comment>(
    db,
    'rate_comments_company',
    commentModel,
    'rates_company',
    'id',
    'author',
    'replyCount',
    'author',
    'id'
  );
  // select id, imageurl as url from users;
  const queryUrl = useUrlQuery<string>(db.query, 'users', 'imageURL', 'id');
  return new ReactionService<Rate, RateFilter>(
    builder.search,
    rateRepository,
    rateReactionRepository,
    rateCommentRepository,
  );
}

export function useCompanyReactionController(
  log: Log,
  db: DB,
  mapper?: TemplateMap
): ReactionController<Rate, RateFilter, Comment> {
  const commentValidator = new CommentValidator(commentModel, check);
  return new ReactionController(
    log,
    useCompanyReactionService(db, mapper),
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
export function useCompanyRateCommentService(
  db: DB,
  mapper?: TemplateMap
): CommentQuery<Comment, CommentFilter> {
  const query = useQuery('ratecomment', mapper, commentModel, true);
  const builder = new SearchBuilder<Comment, CommentFilter>(
    db.query,
    'rate_comments',
    commentModel,
    db.driver,
    query
  );
  const rateCommentRepository = new SqlCommentRepository<Comment>(
    db,
    'rate_comments',
    commentModel,
    'rates_company',
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

export function useCompanyRateCommentController(
  log: Log,
  db: DB,
  mapper?: TemplateMap
): RateCommentController<Comment> {
  return new RateCommentController(
    log,
    useCompanyRateCommentService(db, mapper)
  );
}

export function generate(): string {
  return shortid.generate();
}
