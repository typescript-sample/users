import { Log, Manager, Search } from "onecore";
import { buildToSave, useUrlQuery } from "pg-extension";
import { DB, SearchBuilder } from "query-core";
import { TemplateMap, useQuery } from "query-mappers";
import shortid from "shortid";
import {
  CommentQuery,
  Info,
  infoModel,
  InfoRepository,
  Rate,
  Comment,
  CommentFilter,
  RateFilter,
  rateModel,
} from "rate-core";
import { CommentValidator, RateValidator } from "rate-core";
import { RateCommentController, RateController } from "reaction-express";
import {
  SqlRateRepository,
} from "rate-query";
import {
  commentModel,
  rateReactionModel,
  SqlInfoRepository,
  SqlCommentRepository,
  SqlReactionRepository
} from "reaction-query";
import { Rater, RateRepository, RateService } from "rate-core";
import {
  Company,
  CompanyFilter,
  companyModel,
  CompanyRepository,
  CompanyService,
} from "./company";
import { CompanyController } from "./company-controller";
import { SqlCompanyRepository } from "./sql-company-repository";
import { check } from "xvalidators";
export * from "./company-controller";
export { CompanyController };

export class CompanyManager
  extends Manager<Company, string, CompanyFilter>
  implements CompanyService
{
  constructor(
    search: Search<Company, CompanyFilter>,
    repository: CompanyRepository,
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
            delete (info as any)["id"];
            delete (info as any)["count"];
            delete (info as any)["score"];
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
): CompanyService {
  const query = useQuery("company", mapper, companyModel, true);
  const builder = new SearchBuilder<Company, CompanyFilter>(
    db.query,
    "company",
    companyModel,
    db.driver,
    query
  );
  const repository = new SqlCompanyRepository(db, "companies");
  const infoRepository = new SqlInfoRepository<Info>(
    db,
    "info",
    infoModel,
    buildToSave
  );
  return new CompanyManager(builder.search, repository, infoRepository);
}

export function useCompanyController(
  log: Log,
  db: DB,
  mapper?: TemplateMap
): CompanyController {
  return new CompanyController(log, useCompanyService(db, mapper));
}

export function useCompanyRateService(db: DB, mapper?: TemplateMap): Rater {
  const query = useQuery("rates", mapper, rateModel, true);
  const builder = new SearchBuilder<Rate, RateFilter>(
    db.query,
    "rates",
    rateModel,
    db.driver,
    query
  );
  const rateRepository = new SqlRateRepository<Rate>(
    db,
    "rates",
    rateModel,
    buildToSave,
    5,
    "info",
    "rate",
    "count",
    "score",
    "author",
    "id"
  );
  const infoRepository = new SqlInfoRepository<Info>(
    db,
    "info",
    infoModel,
    buildToSave
  );
  const rateReactionRepository = new SqlReactionRepository(
    db,
    "ratereaction",
    rateReactionModel,
    "rates",
    "usefulCount",
    "author",
    "id"
  );
  const rateCommentRepository = new SqlCommentRepository<Comment>(
    db,
    "rate_comments",
    commentModel,
    "rates",
    "id",
    "author",
    "replyCount",
    "author",
    "id"
  );
  // select id, imageurl as url from users;
  const queryUrl = useUrlQuery<string>(db.query, "users", "imageURL", "id");
  return new RateService(
    builder.search,
    rateRepository,
    infoRepository,
    rateCommentRepository,
    rateReactionRepository,
    queryUrl
  );
}

export function useCompanyRateController(
  log: Log,
  db: DB,
  mapper?: TemplateMap
): RateController<Rate, RateFilter, Comment> {
  const rateValidator = new RateValidator(rateModel, check, 5);
  const commentValidator = new CommentValidator(commentModel, check);
  return new RateController(
    log,
    useCompanyRateService(db, mapper),
    rateValidator,
    commentValidator,
    ["time"],
    ["rate", "usefulCount", "replyCount", "count", "score"],
    generate,
    "commentId",
    "userId",
    "author",
    "id"
  );
}

export function useCompanyRateCommentService(
  db: DB,
  mapper?: TemplateMap
): CommentQuery {
  const query = useQuery("ratecomment", mapper, commentModel, true);
  const builder = new SearchBuilder<Comment, CommentFilter>(
    db.query,
    "rate_comments",
    commentModel,
    db.driver,
    query
  );
  const rateCommentRepository = new SqlCommentRepository<Comment>(
    db,
    "rate_comments",
    commentModel,
    "rates",
    "id",
    "author",
    "replyCount",
    "author",
    "time",
    "id"
  );
  const queryUrl = useUrlQuery<string>(db.query, "users", "imageURL", "id");
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
