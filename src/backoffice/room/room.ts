import { Attributes, Filter, Repository, Service } from 'onecore';

export interface RoomFilter extends Filter {
    id?: string;
    title?: string;
    description?: string;
    offer?: string[];
    price?: number;
    location?: string;
    host?: string;
    guest?: number;
    room?: string[];
    highlight?: string[];
    status?: string;
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
    room: string[];
    highlight: string[];
    status: string;
}
export interface RoomRepository extends Repository<Room, string> {

}
export interface RoomService extends Service<Room, string, RoomFilter> {

}

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
    price:{
        type:'number'
    },
    offer:{
        type:'strings'
    },
    location:{
        length:255
    },
    host:{
        length:255
    },
    guest:{
        type:'number'
    },
    room:{
        type:'strings'
    },
    highlight:{
        type:'strings'
    },
    status:{
        type:'string'
    }
};
