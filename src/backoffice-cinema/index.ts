import { Log, Manager, Search } from "onecore";
import { buildToSave, useUrlQuery } from "pg-extension";
import { DB, SearchBuilder, SqlLoadRepository } from "query-core";
import { TemplateMap, useQuery } from "query-mappers";
import shortid from "shortid";
import {
  Cinema,
  CinemaFilter,
  cinemaModel,
  CinemaRepository,
  CinemaService,
} from "./cinema";
import { BackOfficeCinemaController } from "./cinema-controller";
import { SqlCinemaRepository } from "./sql-cinema-repository";

export { BackOfficeCinemaController };

export class CinemaManager
  extends Manager<Cinema, string, CinemaFilter>
  implements CinemaService
{
  constructor(
    search: Search<Cinema, CinemaFilter>,
    repository: CinemaRepository,
  ) {
    super(search, repository);
  }

}

export function useBackOfficeCinemaService(db: DB, mapper?: TemplateMap): CinemaService {
  const query = useQuery("cinema", mapper, cinemaModel, true);
  const builder = new SearchBuilder<Cinema, CinemaFilter>(
    db.query,
    "cinema",
    cinemaModel,
    db.driver,
    query
  );
  const repository = new SqlCinemaRepository(db, "cinema");
  return new CinemaManager(builder.search, repository);
}

export function useBackOfficeCinemaController(
  log: Log,
  db: DB,
  mapper?: TemplateMap
): BackOfficeCinemaController {
  return new BackOfficeCinemaController(log, useBackOfficeCinemaService(db, mapper));
}


export function generate(): string {
  return shortid.generate();
}
