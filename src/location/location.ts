import { Attributes, Filter, Service } from "onecore";
import { Repository } from 'query-core';
import { Info } from "rate-core";

export interface LocationFilter extends Filter {
  id?: string;
  name?: string;
  type?: string;
  description?: string;
  status?: string;
  latitude?: number;
  longitude?: number;
  info?: Info;
}

export interface Location {
  id: string;
  name: string;
  type?: string;
  description?: string;
  status?: string;
  latitude?: number;
  longitude?: number;
  imageURL?: string;
  coverURL?: string;
  info?: Info;
}


export interface LocationRepository extends Repository<Location, string> {}

export interface LocationService
  extends Service<Location, string, LocationFilter> {}


export const locationModel: Attributes = {
  id: {
    key: true,
    length: 40,
  },
  name: {
    required: true,
    q: true,
  },
  type: {
    match: "equal",
    required: true,
  },
  description: {
    q: true,
  },
  status: {
    match: "equal",
    length: 1,
  },
  latitude: {
    type: "number",
  },
  longitude: {
    type: "number",
  },
  imageURL: {},
  coverURL: {},
};

