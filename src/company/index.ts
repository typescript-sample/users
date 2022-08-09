
import { Log, Search, ViewSearchManager } from 'onecore';
import { buildToSave, useUrlQuery } from 'pg-extension';
import { DB, Repository, SearchBuilder, SqlLoadRepository } from 'query-core';
import { TemplateMap, useQuery } from 'query-mappers';
import {
  Info,
  infoModel, RatesService,
  RatesValidator
} from 'rate-core';
import shortid from 'shortid';
import { SqlRatesRepository } from 'rate-query';
import {
  Comment,
  CommentFilter,
  CommentValidator,
  ReactionService
} from 'review-reaction';
import {
  RateCommentController,
  RateController,
  ReactionController
} from 'review-reaction-express';
import {
  commentModel, CommentQuery, InfoRepository,
  rateReactionModel,
  SqlCommentRepository,
  SqlInfoRepository,
  SqlReactionRepository
} from 'review-reaction-query';
import { check } from 'xvalidators';
import {
  RateCriteria,
  RateCriteriaFilter,
  rateCriteriaModel, RateFullInfo
} from './rate-criteria';
import {
  Company,
  CompanyFilter,
  companyModel, CompanyQuery, CompanyRepository
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

export function useCompanyController(log: Log, db: DB, mapper?: TemplateMap): CompanyController {
  return new CompanyController(log, useCompanyService(db, mapper));
}

export function useCompanyRateController(
  log: Log,
  db: DB,
  mapper?: TemplateMap
): RateController<RateCriteria> {
  const rateRepository = new SqlRatesRepository<RateCriteria>(
    db,
    'company_rate',
    'company_rate_full_info',
    [
      'company_rate_info01',
      'company_rate_info02',
      'company_rate_info03',
      'company_rate_info04',
      'company_rate_info05',
    ],
    rateCriteriaModel,
    buildToSave,
    5,
    'rate',
    'count',
    'score',
    'author',
    'id'
  );

  const infoRepository = new SqlInfoRepository<RateFullInfo>(
    db,
    'company_rate_full_info',
    infoModel,
    buildToSave
  );
  const rateValidator = new RatesValidator(rateCriteriaModel, check, 5, 5);
  const rateService = new RatesService(rateRepository, infoRepository);
  return new RateController(
    log, rateService.rate, rateValidator.validate, 'author', 'id'
  );
}

export function useCompanyRateReactionService(db: DB, mapper?: TemplateMap): ReactionService<RateCriteria, RateCriteriaFilter> {
  const query = useQuery('company_rate', mapper, rateCriteriaModel, true);
  const builder = new SearchBuilder<RateCriteria, RateCriteriaFilter>(
    db.query,
    'company_rate',
    rateCriteriaModel,
    db.driver,
    query
  );

  const rateRepository = new SqlLoadRepository<RateCriteria, string, string>(
    db.query,
    'company_rate',
    rateCriteriaModel,
    db.param,
    'id',
    'author'
  );

  const rateReactionRepository = new SqlReactionRepository(
    db,
    'company_rate_reaction',
    rateReactionModel,
    'company_rate',
    'usefulCount',
    'author',
    'id'
  );
  const rateCommentRepository = new SqlCommentRepository<Comment>(
    db,
    'company_rate_comment',
    commentModel,
    'company_rate',
    'id',
    'author',
    'replyCount',
    'author',
    'id'
  );

  return new ReactionService<RateCriteria, RateCriteriaFilter>(
    builder.search,
    rateRepository,
    rateReactionRepository,
    rateCommentRepository
  );
}

export function useCompanyRateReactionController(
  log: Log,
  db: DB,
  mapper?: TemplateMap
): ReactionController<RateCriteria, RateCriteriaFilter, Comment> {
  const commentValidator = new CommentValidator(commentModel, check);
  return new ReactionController(
    log,
    useCompanyRateReactionService(db, mapper),
    commentValidator,
    ['time'],
    ['rates', 'usefulCount', 'replyCount', 'count', 'score'],
    generate,
    'commentId',
    'userId',
    'author',
    'id'
  );
}

export function useCompanyRateCommentService(
  db: DB,
  mapper?: TemplateMap
): CommentQuery<Comment, CommentFilter> {
  const query = useQuery('company_rate_comment', mapper, commentModel, true);
  const builder = new SearchBuilder<Comment, CommentFilter>(
    db.query,
    'company_rate_comment',
    commentModel,
    db.driver,
    query
  );
  const rateCommentRepository = new SqlCommentRepository<Comment>(
    db,
    'company_rate_comment',
    commentModel,
    'company_rate',
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



// export function useCompanyRateController(
//   log: Log,
//   db: DB,
//   mapper?: TemplateMap
// ): RateController<Rate> {
//   const rateRepository = new SqlRateRepository<Rate>(
//     db,
//     'company_rates',
//     rateModel,
//     buildToSave,
//     5,
//     'info_company',
//     'rate',
//     'count',
//     'score',
//     'author',
//     'id'
//   );
//   const infoRepository = new SqlInfoRepository<Info>(
//     db,
//     'info_company',
//     infoModel,
//     buildToSave
//   );
//   const rateValidator = new RateValidator(rateModel, check, 5);
//   const rateService = new RateService(rateRepository, infoRepository);
//   return new RateController(
//     log,
//     rateService.rate,
//     rateValidator.validate,
//     'author',
//     'id'
//   );
// }

// // Reaction
// export function useCompanyReactionService(
//   db: DB,
//   mapper?: TemplateMap
// ): ReactionService<Rate, RateFilter> {
//   const query = useQuery('rates_company', mapper, rateModel, true);
//   const builder = new SearchBuilder<Rate, RateFilter>(
//     db.query,
//     'rates_company',
//     rateModel,
//     db.driver,
//     query
//   );
//   const rateRepository = new SqlLoadRepository<Rate, string, string>(
//     db.query,
//     'rates_company',
//     rateModel,
//     db.param,
//     'id',
//     'author'
//   );
//   const rateReactionRepository = new SqlReactionRepository(
//     db,
//     'ratereaction_company',
//     rateReactionModel,
//     'rates',
//     'usefulCount',
//     'author',
//     'id'
//   );
//   const rateCommentRepository = new SqlCommentRepository<Comment>(
//     db,
//     'rate_comments_company',
//     commentModel,
//     'rates_company',
//     'id',
//     'author',
//     'replyCount',
//     'author',
//     'id'
//   );
//   // select id, imageurl as url from users;
//   const queryUrl = useUrlQuery<string>(db.query, 'users', 'imageURL', 'id');
//   return new ReactionService<Rate, RateFilter>(
//     builder.search,
//     rateRepository,
//     rateReactionRepository,
//     rateCommentRepository,
//   );
// }

// export function useCompanyReactionController(
//   log: Log,
//   db: DB,
//   mapper?: TemplateMap
// ): ReactionController<Rate, RateFilter, Comment> {
//   const commentValidator = new CommentValidator(commentModel, check);
//   return new ReactionController(
//     log,
//     useCompanyReactionService(db, mapper),
//     commentValidator,
//     ['time'],
//     ['rate', 'usefulCount', 'replyCount', 'count', 'score'],
//     generate,
//     'commentId',
//     'userId',
//     'author',
//     'id'
//   );
// }

// // Comment
// export function useCompanyRateCommentService(
//   db: DB,
//   mapper?: TemplateMap
// ): CommentQuery<Comment, CommentFilter> {
//   const query = useQuery('ratecomment', mapper, commentModel, true);
//   const builder = new SearchBuilder<Comment, CommentFilter>(
//     db.query,
//     'rate_comments',
//     commentModel,
//     db.driver,
//     query
//   );
//   const rateCommentRepository = new SqlCommentRepository<Comment>(
//     db,
//     'rate_comments',
//     commentModel,
//     'rates_company',
//     'id',
//     'author',
//     'replyCount',
//     'author',
//     'time',
//     'id'
//   );
//   const queryUrl = useUrlQuery<string>(db.query, 'users', 'imageURL', 'id');
//   return new CommentQuery(builder.search, rateCommentRepository, queryUrl);
// }

// export function useCompanyRateCommentController(
//   log: Log,
//   db: DB,
//   mapper?: TemplateMap
// ): RateCommentController<Comment> {
//   return new RateCommentController(
//     log,
//     useCompanyRateCommentService(db, mapper)
//   );
// }

export function generate(): string {
  return shortid.generate();
}
