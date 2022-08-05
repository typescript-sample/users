import { DB, Repository } from 'query-core';
import { Location, locationModel, LocationRepository } from './location';

export class SqlLocationRepository extends Repository<Location, string> implements LocationRepository {
  constructor(db: DB) {
    super(db, 'locations' , locationModel);
  }
}
