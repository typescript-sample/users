import { Log, Manager, Search } from "onecore";
import { buildToSave, useUrlQuery } from "pg-extension";
import { DB, SearchBuilder } from "query-core";
import { TemplateMap, useQuery } from "query-mappers";
import shortid from "shortid";
import {
  Info,
  infoModel,
  InfoRepository,
  Rate,
  Comment,
  CommentFilter,
  RateFilter,
  rateModel,
  CommentValidator,
  RateValidator,
  Rater, RateService
} from "reaction-service";
import { CommentQuery } from "reaction-query";
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
import {
  Cinema,
  CinemaFilter,
  cinemaModel,
  CinemaRepository,
  CinemaService,
} from "./cinema";
import { CinemaController } from "./cinema-controller";
import { SqlCinemaRepository } from "./sql-cinema-repository";
import { check } from "xvalidators";

export { CinemaController };

export class CinemaManager
  extends Manager<Cinema, string, CinemaFilter>
  implements CinemaService
{
  constructor(
    search: Search<Cinema, CinemaFilter>,
    repository: CinemaRepository,
    private infoRepository: InfoRepository<Info>
  ) {
    super(search, repository);
  }

  load(id: string): Promise<Cinema | null> {
    return this.repository.load(id).then((cinema) => {
      if (!cinema) {
        return null;
      } else {
        return this.infoRepository.load(id).then((info) => {
          if (info) {
            delete (info as any)["id"];
            delete (info as any)["count"];
            delete (info as any)["score"];
            cinema.info = info;
          }
          console.log({ cinema });

          return cinema;
        });
      }
    });
  }
}

export function useCinemaService(db: DB, mapper?: TemplateMap): CinemaService {
  const query = useQuery("cinema", mapper, cinemaModel, true);
  const builder = new SearchBuilder<Cinema, CinemaFilter>(
    db.query,
    "cinema",
    cinemaModel,
    db.driver,
    query
  );
  const repository = new SqlCinemaRepository(db, "cinema");
  const infoRepository = new SqlInfoRepository<Info>(
    db,
    "info",
    infoModel,
    buildToSave
  );
  return new CinemaManager(builder.search, repository, infoRepository);
}

export function useCinemaController(
  log: Log,
  db: DB,
  mapper?: TemplateMap
): CinemaController {
  return new CinemaController(log, useCinemaService(db, mapper));
}

export function useCinemaRateService(db: DB, mapper?: TemplateMap): Rater<Rate, RateFilter> {
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

export function useCinemaRateController(
  log: Log,
  db: DB,
  mapper?: TemplateMap
): RateController<Rate, RateFilter, Comment> {
  const rateValidator = new RateValidator(rateModel, check, 5);
  const commentValidator = new CommentValidator(commentModel, check);
  return new RateController(
    log,
    useCinemaRateService(db, mapper),
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

export function useCinemaRateCommentService(
  db: DB,
  mapper?: TemplateMap
): CommentQuery<Comment, CommentFilter> {
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

export function useCinemaRateCommentController(
  log: Log,
  db: DB,
  mapper?: TemplateMap
): RateCommentController<Comment> {
  return new RateCommentController(
    log,
    useCinemaRateCommentService(db, mapper)
  );
}
export function generate(): string {
  return shortid.generate();
}
