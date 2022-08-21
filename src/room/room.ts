import { Attributes, Filter, NumberRange, Query, Repository } from 'onecore';

export interface RoomFilter extends Filter {
  id?: string;
  title?: string;
  description?: string;
  offer?: string[];
  price?: NumberRange;
  location?: string;
  host?: string;
  guest?: number;
  bedrooms?: number;
  bed?: number;
  bathrooms?: number;
  highlight?: string[];
  status?: string;
  category?: string[];
  region?: string;
  typeof?: string[];
  property?: string;
  language?: string[];
}
export interface Room {
  id: string;
  title: string;
  description: string;
  offer?: string[];
  price: number;
  location: string;
  host: string;
  guest: number;
  bedrooms: number;
  bed: number;
  bathrooms: number;
  highlight: string[];
  status: string;
  category?: string[];
  region?: string;
  typeof?: string[];
  property?: string;
  language?: string[];
  imageUrl?: UploadImage[];
}
export interface UploadImage {
  source?: string;
  type?: string;
  url: string;
}

export interface RoomRepository extends Repository<Room, string> {

}

export interface RoomQuery extends Query<Room, string, RoomFilter> {
  saveReservation(roomid: string, startdate: Date, enddate: Date): Promise<number | undefined>;
}
export const fileUploadImageModel: Attributes = {
  type: {},
  url: {
  },
  source: {
  },
};
export const roomModel: Attributes = {
  id: {
    key: true,
    length: 40,
  },
  title: {
    length: 120
  },
  description: {
    length: 1000
  },
  price: {
    type: 'number'
  },
  offer: {
    type: 'strings'
  },
  location: {
    length: 255
  },
  host: {
    length: 255
  },
  guest: {
    type: 'number'
  },
  bedrooms: {
    type: 'number'
  },
  bed: {
    type: 'number'
  },
  bathrooms: {
    type: 'number'
  },
  highlight: {
    type: 'strings'
  },
  status: {
    type: 'string'
  },
  category: {
    type: 'strings'
  },
  region: {
    type: 'string'
  },
  typeof: {
    type: 'strings'
  },
  property: {
    type: 'string'
  },
  language: {
    type: 'strings'
  },
  imageUrl: {
    type: 'array',
    typeof: fileUploadImageModel,
  },
};
export interface ReservationRoomRepository extends Repository<Reservation, string> {
  search(roomid: string, startdate: Date, enddate: Date): Promise<number>;
}
export interface Reservation {
  id: string;
  startdate: Date;
  enddate: Date;
  guestid: string;
  totalprice: number;
  roomid: string;
}
export const reservationModel: Attributes = {
  id: {
    key: true,
    length: 40,
  },
  startdate: {
    type: 'datetime'
  },
  enddate: {
    type: 'datetime'
  },
  guestid: {
    length: 250
  },
  totalprice: {
    type: 'number'
  },
  roomid: {
    length: 250
  }
};
