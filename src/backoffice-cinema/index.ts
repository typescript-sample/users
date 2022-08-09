import { Log, Manager, Search } from "onecore";
import { DB, Repository, SearchBuilder } from "query-core";
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

export function useBackOfficeCinemaController(
  log: Log,
  db: DB,
  mapper?: TemplateMap
): BackOfficeCinemaController {

  const query = useQuery("cinema", mapper, cinemaModel, true);
  const builder = new SearchBuilder<Cinema, CinemaFilter>(
    db.query,
    "cinema",
    cinemaModel,
    db.driver,
    query
  );
  const repository = new Repository<Cinema, string>(db, "cinema", cinemaModel);
  const service = new CinemaManager(builder.search, repository);
  return new BackOfficeCinemaController(log, service);
}


export function generate(): string {
  return shortid.generate();
}
