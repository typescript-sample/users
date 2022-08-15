import { Controller, Log } from 'express-ext';
import { Room, RoomFilter, RoomService } from './room';

export class BackOfficeRoomController extends Controller<Room, string, RoomFilter> {
  constructor(log: Log, roomService: RoomService) {
    super(log, roomService);
  }
}