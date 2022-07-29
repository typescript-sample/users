import { Log, Manager, Search } from 'onecore';
import { postgres, SearchBuilder, DB } from 'query-core';
import { buildQuery } from './query';
import { TemplateMap, useQuery } from 'query-mappers';
import { buildToSave } from 'pg-extension';
import { Company, CompanyFilter, companyModel, CompanyRepository, CompanyService } from './company';
import {
  Info, infoModel, InfoRepository, Rate, RateComment, RateCommentFilter, rateCommentModel, RateCommentService, RateFilter,
  RateCommentManager, RateManager, rateModel, RateRepository, RateService
} from 'rate5';
import { rateReactionModel, SqlInfoRepository, SqlRateCommentRepository, SqlRateReactionRepository, SqlRateRepository } from 'rate-query';
import { CompanyController } from './company-controller';
import shortid from 'shortid';
export * from './company';
export { CompanyController };

import { SqlCompanyRepository } from './sql-company-responsitory';
import { RateCommentController, RateController } from '../rate-company';

export class CompanyManager extends Manager<Company, string, CompanyFilter> implements CompanyService {
  constructor(search: Search<Company, CompanyFilter>,
    repository: CompanyRepository,
    private infoRepository: InfoRepository,
    private rateRepository: RateRepository
  ) {
    super(search, repository);

  }
  load(id: string): Promise<Company | null> {
    return this.repository.load(id).then(company => {
      if (!company) {
        return null;
      } else {
        return this.infoRepository.load(id).then(info => {
          if (info) {
            delete (info as any)['id'];
            company.info = info;
          }
          return company;
        });
      }
    });
  }
}
// export function useCompanyService(db: DB): CompanyService {
//   const builder = new SearchBuilder<Company, CompanyFilter>(db.query, 'companies', companyModel, postgres, buildQuery);
//   const repository = new SqlCompanyRepository(db);
//   const infoRepository = new SqlInfoRepository<Info>(db, 'info_company', infoModel, buildToSave);
//   const rateRepository = new SqlRateRepository(db, 'rates_company', rateModel, buildToSave);
//   return new CompanyManager(builder.search, repository, infoRepository, rateRepository);
// }
// export function useCompanyController(log: Log, db: DB): CompanyController {
//   return new CompanyController(log, useCompanyService(db));
// }

export function useCinemaRateService(db: DB, mapper?: TemplateMap): RateService {
  const query = useQuery('rates_company', mapper, rateModel, true);
  const builder = new SearchBuilder<Rate, RateFilter>(db.query, 'rates_company', rateModel, db.driver, query);
  const repository = new SqlRateRepository(db, 'rates_company', rateModel, buildToSave);
  const infoRepository = new SqlInfoRepository<Info>(db, 'info_company', infoModel, buildToSave);
  const rateReactionRepository = new SqlRateReactionRepository(db, 'ratereaction_company', rateReactionModel, 'rates', 'usefulCount', 'author', 'id');
  const rateCommentRepository = new SqlRateCommentRepository(db, 'rate_comments_company', rateCommentModel, 'rates', 'replyCount', 'author', 'id');
  return new RateManager(builder.search, repository, infoRepository, rateCommentRepository, rateReactionRepository);
}

export function useCinemaRateController(log: Log, db: DB, mapper?: TemplateMap): RateController {
  return new RateController(log, useCinemaRateService(db, mapper), generate, 'commentId', 'userId', 'author', 'id');
}
export function useCinemaRateCommentService(db: DB, mapper?: TemplateMap): RateCommentService {
  const query = useQuery('ratecomment_company', mapper, rateCommentModel, true);
  const builder = new SearchBuilder<RateComment, RateCommentFilter>(db.query, 'rate_comments_company', rateCommentModel, db.driver, query);
  const rateCommentRepository = new SqlRateCommentRepository(db, 'rate_comments_company', rateCommentModel, 'rates', 'replyCount', 'author', 'id');
  return new RateCommentManager(builder.search, rateCommentRepository);
}
export function useRateCommentController(log: Log, db: DB, mapper?: TemplateMap): RateCommentController {
  return new RateCommentController(log, useCinemaRateCommentService(db, mapper));
}
export function generate(): string {
  return shortid.generate();
}
export function useCompanyService(db: DB, mapper?: TemplateMap): CompanyService {
  const queryCompany = useQuery('companies', mapper, companyModel, true);
  const builder = new SearchBuilder<Company, CompanyFilter>(db.query, 'companies', companyModel,  db.driver, queryCompany);
  const repository = new SqlCompanyRepository(db);
  const infoRepository = new SqlInfoRepository<Info>(db, 'info_company', infoModel, buildToSave);
    const rateRepository = new SqlRateRepository(db, 'rates_company', rateModel, buildToSave);
  return new CompanyManager(builder.search, repository, infoRepository, rateRepository);
}
export function useCompanyController(log: Log, db: DB, mapper?: TemplateMap): CompanyController {
  return new CompanyController(log, useCompanyService(db, mapper));
}