import { Controller} from 'express-ext';
import { Log, Manager, Search } from 'onecore';
import { DB, Repository, SearchBuilder } from 'query-core';
import { TemplateMap, useQuery } from 'query-mappers';
import {
  Room,
  RoomFilter,
  roomModel,
  RoomRepository,
  RoomService,
} from './room';

export class BackOfficeRoomController extends Controller<Room, string, RoomFilter> {
  constructor(log: Log, roomService: RoomService) {
    super(log, roomService);
  }
}

export class RoomManager extends Manager<Room, string, RoomFilter> implements RoomService {
  constructor(search: Search<Room, RoomFilter>, repository: RoomRepository) {
    super(search, repository);
  }
}

export function useBackOfficeRoomController(log: Log, db: DB, mapper?: TemplateMap): BackOfficeRoomController {
  const queryRoom = useQuery('room', mapper, roomModel, true);
  const builder = new SearchBuilder<Room, RoomFilter>(db.query, 'room', roomModel,  db.driver, queryRoom);
  const repository = new Repository<Room, string>(db, 'room', roomModel);
  const service = new RoomManager(builder.search, repository );
  return new BackOfficeRoomController(log, service);
}
