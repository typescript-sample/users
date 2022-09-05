import { Request, Response } from 'express';
import { Log, QueryController } from 'express-ext';
import { Search, ViewSearchManager } from 'onecore';
import { Statement } from 'pg-extension';
import { DB, Repository, SearchBuilder } from 'query-core';
import { TemplateMap, useQuery } from 'query-mappers';
import {
  Reservation,
  reservationModel,
  ReservationRoomRepository,
  Room,
  RoomFilter,
  roomModel,
  RoomQuery,
  RoomRepository,
} from './room';

export class RoomController extends QueryController<Room, string, RoomFilter> {
  constructor(log: Log, protected roomService: RoomQuery) {
    super(log, roomService);
     this.saveReservation = this.saveReservation.bind(this);
  }
  saveReservation(req: Request, res: Response) {
    const roomid = req.body.roomid;
    const startdate = req.body.startdate;
    const enddate = req.body.enddate;
    this.roomService.saveReservation(roomid, startdate, enddate).then(data => {
      return res.status(200).json(data).end();
    })
    .catch(err => this.log(err));
  }
}

export class RoomService extends ViewSearchManager<Room, string, RoomFilter> implements RoomQuery {
  constructor(search: Search<Room, RoomFilter>, repository: RoomRepository, protected reservationRepository: SqlReservationRoomRepository) {
    super(search, repository);
    this.saveReservation = this.saveReservation.bind(this);
  }
  async saveReservation(roomid: string, startdate: Date, enddate: Date): Promise<number|undefined> {
    const test = await this.reservationRepository.load(roomid)
    console.log(test);
    const rep = await this.reservationRepository.search(roomid, startdate, enddate);
    if (rep) {
      return Promise.resolve(1);
    }
  }
}

export function useRoomController(log: Log, db: DB, mapper?: TemplateMap): RoomController {
  const queryRoom = useQuery('room', mapper, roomModel, true);
  const builder = new SearchBuilder<Room, RoomFilter>(db.query, 'room', roomModel, db.driver, queryRoom);
  const repository = new Repository<Room, string>(db, 'room', roomModel);
  const reservationRepository = new SqlReservationRoomRepository(db, db.execBatch, 'startdate', 'enddate', 'roomid');
  const service = new RoomService(builder.search, repository, reservationRepository);
  return new RoomController(log, service);
}

export class SqlReservationRoomRepository extends Repository<Reservation, string> implements ReservationRoomRepository {
  constructor(
    public db: DB,
    public execute: (statements: Statement[], firstSuccess?: boolean, ctx?: any) => Promise<number>,
    public startdate: string,
    public enddate: string,
    public roomid: string
  ) {
    super(db, 'reservation', reservationModel);
    this.search = this.search.bind(this); 
  }
  search(roomid: string, startdate: Date, enddate: Date): Promise<Reservation[]> {
    const check = `select ${this.roomid} from ${this.table} where ${this.startdate} = $1 and ${this.enddate} = $2 `;
    return this.db.query<Reservation>(check, [startdate, enddate]).then(room => {
      console.log(room)
      return room
    })
  }
}
