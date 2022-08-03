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
  commentModel,
  rateReactionModel,
  SqlInfoRepository,
  SqlCommentRepository,
  SqlReactionRepository
} from "reaction-query";
import {
  SqlRateRepository,
} from "rate-query";
import { Rater, RateService } from "rate-core";
import {
  Location,
  LocationFilter,
  locationModel,
  LocationRepository,
  LocationService,
} from "./location";
import { LocationController } from "./location-controller";
import { SqlLocationRepository } from "./sql-location-repository";
import { check } from "xvalidators";
export * from "./location-controller";
export { LocationController };

export class LocationManager
  extends Manager<Location, string, LocationFilter>
  implements LocationService
{
  constructor(
    search: Search<Location, LocationFilter>,
    repository: LocationRepository,
    private infoRepository: InfoRepository<Info>
  ) {
    super(search, repository);
  }

  load(id: string): Promise<Location | null> {
    return this.repository.load(id).then((location) => {
      if (!location) {
        return null;
      } else {
        return this.infoRepository.load(id).then((info) => {
          if (info) {
            delete (info as any)["id"];
            delete (info as any)["count"];
            delete (info as any)["score"];
            location.info = info;
          }
          console.log({ location });

          return location;
        });
      }
    });
  }
}

export function useLocationService(
  db: DB,
  mapper?: TemplateMap
): LocationService {
  const query = useQuery("locations", mapper, locationModel, true);
  const builder = new SearchBuilder<Location, LocationFilter>(
    db.query,
    "locations",
    locationModel,
    db.driver,
    query
  );
  const repository = new SqlLocationRepository(db, "locations");
  const infoRepository = new SqlInfoRepository<Info>(
    db,
    "location_info",
    infoModel,
    buildToSave
  );
  return new LocationManager(builder.search, repository, infoRepository);
}

export function useLocationController(
  log: Log,
  db: DB,
  mapper?: TemplateMap
): LocationController {
  return new LocationController(log, useLocationService(db, mapper));
}

export function useLocationRateService(db: DB, mapper?: TemplateMap): Rater {
  const query = useQuery("location_rates", mapper, rateModel, true);
  const builder = new SearchBuilder<Rate, RateFilter>(
    db.query,
    "location_rates",
    rateModel,
    db.driver,
    query
  );
  const rateRepository = new SqlRateRepository<Rate>(
    db,
    "location_rates",
    rateModel,
    buildToSave,
    5,
    "location_info",
    "rate",
    "count",
    "score",
    "author",
    "id"
  );
  const infoRepository = new SqlInfoRepository<Info>(
    db,
    "location_info",
    infoModel,
    buildToSave
  );
  const rateReactionRepository = new SqlReactionRepository(
    db,
    "location_ratereaction",
    rateReactionModel,
    "location_rates",
    "usefulCount",
    "author",
    "id"
  );
  const rateCommentRepository = new SqlCommentRepository<Comment>(
    db,
    "location_comments",
    commentModel,
    "location_rates",
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

export function useLocationRateController(
  log: Log,
  db: DB,
  mapper?: TemplateMap
): RateController<Rate, RateFilter, Comment> {
  const rateValidator = new RateValidator(rateModel, check, 5);
  const commentValidator = new CommentValidator(commentModel, check);
  return new RateController(
    log,
    useLocationRateService(db, mapper),
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

export function useLocationRateCommentService(
  db: DB,
  mapper?: TemplateMap
): CommentQuery {
  const query = useQuery("location_comments", mapper, commentModel, true);
  const builder = new SearchBuilder<Comment, CommentFilter>(
    db.query,
    "location_comments",
    commentModel,
    db.driver,
    query
  );
  const rateCommentRepository = new SqlCommentRepository<Comment>(
    db,
    "location_comments",
    commentModel,
    "location_rates",
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

export function useLocationRateCommentController(
  log: Log,
  db: DB,
  mapper?: TemplateMap
): RateCommentController<Comment> {
  return new RateCommentController(
    log,
    useLocationRateCommentService(db, mapper)
  );
}
export function generate(): string {
  return shortid.generate();
}
