import {  ViewSearchManager, Search } from 'onecore';
import { DB, Repository, SearchBuilder } from 'query-core';
import { TemplateMap, useQuery } from 'query-mappers';
import { Log } from 'express-ext';
import {
  Room,
  RoomFilter,
  roomModel,
  RoomRepository,
  RoomQuery,
} from './room';
import { QueryController } from 'express-ext';

export class RoomController extends QueryController<Room, string, RoomFilter> {
  constructor(log: Log, roomService: RoomQuery) {
    super(log, roomService);
  }
}


export class RoomService extends ViewSearchManager<Room, string, RoomFilter> implements RoomQuery {
  constructor(search: Search<Room, RoomFilter>, repository: RoomRepository) {
    super(search, repository);
  }
}

export function useRoomController(log: Log, db: DB, mapper?: TemplateMap): RoomController {
  const queryRoom = useQuery('room', mapper, roomModel, true);
  const builder = new SearchBuilder<Room, RoomFilter>(db.query, 'room', roomModel,  db.driver, queryRoom);
  const repository = new Repository<Room, string>(db, 'room', roomModel);
  const service = new RoomService(builder.search, repository );
  return new RoomController(log, service);
}