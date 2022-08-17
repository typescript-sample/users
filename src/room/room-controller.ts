import { QueryController, Log } from 'express-ext';
import { Room, RoomFilter, RoomQuery } from './room';

export class RoomController extends QueryController<Room, string, RoomFilter> {
  constructor(log: Log, roomService: RoomQuery) {
    super(log, roomService);
  }
}