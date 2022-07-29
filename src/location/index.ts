import { buildToSave } from "pg-extension";
import { Log, Manager, Search } from "onecore";
import { DB, postgres, SearchBuilder } from "query-core";
import { TemplateMap, useQuery } from "query-mappers";
import { LocationController } from "./location-controller";
import { SqlLocationRepository } from "./sql-location-repository";
import {
  Location,
  LocationFilter,
  locationModel,
  LocationRepository,
  LocationService,
} from "./location"; // rate
import {
  rateModel,
  infoModel,
  rateReactionModel,
  rateCommentModel,
  Rate,
  RateFilter,
  RateService,
  RateController,
  RateManager,
  RateRepository,
  InfoRepository,
  RateComment,
  RateCommentFilter,
  RateCommentService,
  RateCommentController,
  RateCommentManager,
  SqlRateRepository,
  SqlInfoRepository,
  SqlRateReactionRepository,
  SqlRateCommentRepository,
} from "../rate";

export * from "./location-controller";
export { LocationController, RateController as LocationRateController };

export class LocationManager
  extends Manager<Location, string, LocationFilter>
  implements LocationService
{
  constructor(
    search: Search<Location, LocationFilter>,
    repository: LocationRepository,
    private infoRepository: InfoRepository,
    private rateRepository: RateRepository
  ) {
    super(search, repository);
  }

  load(id: string): Promise<Location | null> {
    console.log(id);
    return this.repository.load(id).then((location) => {
      if (!location) {
        return null;
      } else {
        console.log(this.infoRepository);
        return this.infoRepository.load(id).then((info) => {
          console.log(info);
          if (info) {
            delete (info as any)["id"];
            location.info = info;
          }
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
    postgres,
    query
  );
  const repository = new SqlLocationRepository(db, "locations");
  const infoRepository = new SqlInfoRepository(
    db,
    "location_info",
    rateModel,
    buildToSave
  );
  const rateRepository = new SqlRateRepository(
    db,
    "location_rate",
    infoModel,
    buildToSave
  );
  return new LocationManager(
    builder.search,
    repository,
    infoRepository,
    rateRepository
  );
}

export function useLocationController(
  log: Log,
  db: DB,
  mapper?: TemplateMap
): LocationController {
  return new LocationController(log, useLocationService(db, mapper));
}

// Rate
export function useLocationRateService(
  db: DB,
  mapper?: TemplateMap
): RateService {
  const query = useQuery("location_rate", mapper, rateModel, true);
  const builder = new SearchBuilder<Rate, RateFilter>(
    db.query,
    "location_rate",
    rateModel,
    db.driver,
    query
  );
  const repository = new SqlRateRepository(
    db,
    "location_rate",
    rateModel,
    buildToSave
  );
  const infoRepository = new SqlInfoRepository(
    db,
    "location_info",
    infoModel,
    buildToSave
  );
  const rateReactionRepository = new SqlRateReactionRepository(
    db,
    "location_ratereaction",
    rateReactionModel,
    "location_rate",
    "usefulCount",
    "author",
    "id"
  );

  const rateCommentRepository = new SqlRateCommentRepository(
    db,
    "location_rate_comments",
    rateCommentModel,
    "location_rate",
    "replyCount",
    "author",
    "id"
  );
  return new RateManager(
    builder.search,
    repository,
    infoRepository,
    rateCommentRepository,
    rateReactionRepository
  );
}

export function useLocationRateController(
  log: Log,
  db: DB,
  mapper?: TemplateMap
): RateController {
  return new RateController(log, useLocationRateService(db, mapper));
}

export function useLocationRateCommentService(
  db: DB,
  mapper?: TemplateMap
): RateCommentService {
  const query = useQuery(
    "location_ratecomment",
    mapper,
    rateCommentModel,
    true
  );
  const builder = new SearchBuilder<RateComment, RateCommentFilter>(
    db.query,
    "location_rate_comments",
    rateCommentModel,
    db.driver,
    query
  );
  const rateCommentRepository = new SqlRateCommentRepository(
    db,
    "location_rate_comments",
    rateCommentModel,
    "location_rate",
    "replyCount",
    "author",
    "id"
  );
  return new RateCommentManager(builder.search, rateCommentRepository);
}

export function useLocationRateCommentController(
  log: Log,
  db: DB,
  mapper?: TemplateMap
): RateCommentController {
  return new RateCommentController(
    log,
    useLocationRateCommentService(db, mapper)
  );
}
