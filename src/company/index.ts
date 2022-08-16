
import { BuildUrl, Delete, Generate, Log, Search, ViewSearchManager } from 'onecore';
import { buildToSave, useUrlQuery } from 'pg-extension';
import { DB, postgres, Repository, SearchBuilder, SqlLoadRepository } from 'query-core';
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
} from './company';
import {
  Company,
  CompanyFilter,
  companyModel, CompanyQuery, CompanyRepository
} from './company';
import { CompanyController } from './company-controller';
import { GenericSearchStorageService, ModelConf, StorageConf, UploadInfo } from 'one-storage';
import { StorageRepository } from 'google-storage';
import { UploadService } from 'upload-express';

export * from './company-controller';
export { CompanyController };
export class CompanyService extends ViewSearchManager<Company, string, CompanyFilter> implements CompanyQuery {
  constructor(search: Search<Company, CompanyFilter>, protected repository: CompanyRepository, private infoRepository: InfoRepository<Info>) {
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
          return company;
        });
      }
    });
  }
}

export function useCompanyController(log: Log, db: DB, mapper?: TemplateMap): CompanyController {
  const query = useQuery('company', mapper, companyModel, true);
  const builder = new SearchBuilder<Company, CompanyFilter>(db.query, 'company', companyModel, db.driver, query);
  const repository = new Repository<Company, string>(db, 'company', companyModel);
  const infoRepository = new SqlInfoRepository<Info>(db, 'companyratefullinfo', infoModel, buildToSave);
  const service = new CompanyService(builder.search, repository, infoRepository);
  return new CompanyController(log, service);
}

export function useCompanyRateController(log: Log, db: DB, mapper?: TemplateMap): RateController<RateCriteria> {
  const rateRepository = new SqlRatesRepository<RateCriteria>(db, 'companyrate', 'companyratefulliinnfo',
    ['companyrateinfo01', 'companyrateinfo02', 'companyrateinfo03', 'companyrateinfo04', 'companyrateinfo05'],
    rateCriteriaModel, buildToSave, 5, 'rate', 'count', 'score', 'author', 'id');
  const infoRepository = new SqlInfoRepository<RateFullInfo>(db, 'companyratefullinfo', infoModel, buildToSave);
  const rateValidator = new RatesValidator(rateCriteriaModel, check, 5, 5);
  const rateService = new RatesService(rateRepository, infoRepository);
  return new RateController(
    log, rateService.rate, rateValidator.validate, 'author', 'id'
  );
}

export function useCompanyRateReactionController(log: Log, db: DB, mapper?: TemplateMap): ReactionController<RateCriteria, RateCriteriaFilter, Comment> {
  const query = useQuery('companyrate', mapper, rateCriteriaModel, true);
  const builder = new SearchBuilder<RateCriteria, RateCriteriaFilter>(db.query, 'companyrate', rateCriteriaModel, db.driver, query);
  const rateRepository = new SqlLoadRepository<RateCriteria, string, string>(db.query, 'companyrate', rateCriteriaModel, db.param, 'id', 'author');
  const rateReactionRepository = new SqlReactionRepository(db, 'companyratereaction', rateReactionModel, 'companyrate', 'usefulCount', 'author', 'id');
  const rateCommentRepository = new SqlCommentRepository<Comment>(db, 'companyratecomment', commentModel, 'companyrate', 'id', 'author', 'replyCount', 'author', 'id');
  const service = new ReactionService<RateCriteria, RateCriteriaFilter>(builder.search, rateRepository, rateReactionRepository, rateCommentRepository);
  const commentValidator = new CommentValidator(commentModel, check);
  return new ReactionController(log, service, commentValidator, ['time'], ['rates', 'usefulCount', 'replyCount', 'count', 'score'],
    generate, 'commentId', 'userId', 'author', 'id');
}

export function useCompanyRateCommentService(db: DB, mapper?: TemplateMap): CommentQuery<Comment, CommentFilter> {
  const query = useQuery('companyratecomment', mapper, commentModel, true);
  const builder = new SearchBuilder<Comment, CommentFilter>(db.query, 'companyratecomment', commentModel, db.driver, query);
  const rateCommentRepository = new SqlCommentRepository<Comment>(db, 'companyratecomment', commentModel, 'companyrate', 'id', 'author', 'replyCount', 'author', 'time', 'id');
  const queryUrl = useUrlQuery<string>(db.query, 'users', 'imageURL', 'id');
  return new CommentQuery(builder.search, rateCommentRepository, queryUrl);
}

export function useCompanyRateCommentController(log: Log, db: DB, mapper?: TemplateMap): RateCommentController<Comment> {
  const query = useQuery('companyratecomment', mapper, commentModel, true);
  const builder = new SearchBuilder<Comment, CommentFilter>(db.query, 'companyratecomment', commentModel, db.driver, query);
  const rateCommentRepository = new SqlCommentRepository<Comment>(db, 'companyratecomment', commentModel, 'companyrate', 'id', 'author', 'replyCount', 'author', 'time', 'id');
  const queryUrl = useUrlQuery<string>(db.query, 'users', 'imageURL', 'id');
  const service = new CommentQuery(builder.search, rateCommentRepository, queryUrl);
  return new RateCommentController(log, service);
}

export function generate(): string {
  return shortid.generate();
}

