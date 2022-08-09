import { Log, Manager, Search } from 'onecore';
import { DB, Repository, SearchBuilder } from 'query-core';
import { TemplateMap, useQuery } from 'query-mappers';
import shortid from 'shortid';
import { Location, LocationFilter, locationModel, LocationRepository, LocationService} from './location';
import { BackOfficeLocationController } from './location-controller';
export { BackOfficeLocationController };

export class LocationManager extends Manager<Location, string, LocationFilter> implements LocationService {
  constructor(search: Search<Location, LocationFilter>, repository: LocationRepository) {
    super(search, repository);
  }
}

export function useBackOfficeLocationService( db: DB, mapper?: TemplateMap ): LocationService {
  const query = useQuery('locations', mapper, locationModel, true);
  const builder = new SearchBuilder<Location, LocationFilter>(  db.query, 'locations',  locationModel, db.driver, query );
  const repository = new Repository<Location, string>(db,'locations' , locationModel);
  return new LocationManager(builder.search, repository);
}
export function useBackOfficeLocationController( log: Log, db: DB, mapper?: TemplateMap ): BackOfficeLocationController {
  return new BackOfficeLocationController(log, useBackOfficeLocationService(db, mapper));
}

export function generate(): string {
  return shortid.generate();
}
