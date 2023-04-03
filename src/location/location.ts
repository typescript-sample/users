import { UploadInfo, uploadModel } from 'one-storage';
import { Attributes, Filter, Info, Query, Repository } from 'onecore';

export interface LocationFilter extends Filter {
  id?: string;
  name?: string;
  type?: string;
  description?: string;
  status?: string;
  latitude?: number;
  longitude?: number;
}

export interface Location {
  id?: string;
  name?: string;
  type?: string;
  description?: string;
  status?: string;
  latitude?: number;
  longitude?: number;
  imageURL?: string;
  coverURL?: string;
  info?: Info;
  gallery?: UploadInfo[];
}

export interface LocationRepository extends Repository<Location, string> { }

export interface LocationQuery extends Query<Location, string, LocationFilter> {

}

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
    match: 'equal',
    required: true,
  },
  description: {
    q: true,
  },
  status: {
    match: 'equal',
    length: 1,
  },
  latitude: {
    type: 'number',
  },
  longitude: {
    type: 'number',
  },
  imageURL: {},
  coverURL: {},
  gallery: {
    type: 'array',
    typeof: uploadModel,
  },
};
export interface LocationInfomation {
  id: string;
  followercount: number;
  followingcount: number;
}
export interface LocationInfomationFilter extends Filter {
  id?: string;
  followercount?: number;
  followingcount?: number;
}
export const locationInfomationModel: Attributes = {
  id: {
    key: true,
    length: 40
  },
  followingcount: {
    type: 'number'
  },
  followercount: {
    type: 'number'
  }
};
export interface LocationInfomationQuery extends Query<LocationInfomation, string, LocationInfomationFilter> {
}
export interface LocationInfomationRepository extends Repository<LocationInfomation, string> {
}
