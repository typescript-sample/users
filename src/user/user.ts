import { Attributes, DateRange, Filter,Query, ViewRepository, ViewService,Repository } from 'onecore';

export interface UserFilter extends Filter {
  id?: string;
  username?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: DateRange;
  interests?: string[];
  skills?: Skill[];
}
export interface Skill {
  skill: string;
  hirable?: boolean;
}

export interface Work {
  name: string;
  position: string;
  description: string;
  item: string[];
  from: Date;
  to: Date;
}

export interface Company {
  id?: string;
  name: string;
  position: string;
  descrition: string;
  from: Date;
  to: Date;
}
export interface Education {
  school: string;
  degree: string;
  major: string;
  title: string;
  from: Date;
  to: Date;
}

export interface User {
  id?: string;
  username?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  links?: Social;
  works: Work[];
  companies: Company[];
  educations: Education[];
}

export interface Social {
  google: string;
  facebook: string;
  github: string;
  instagram: string;
  twitter: string;
  skype: string;
  dribble: string;
  linkedin: string;
}
export interface UserRepository extends ViewRepository<User, string> {
}
export interface UserService extends ViewService<User, string> {
}

export const userModel: Attributes = {
  id: {
    key: true,
    length: 40,
  },
  username: {
    length: 120,
  },
  email: {
    length: 120,
  },
  phone: {
    length: 45,
  },
  dateOfBirth: {
    type: 'datetime'
  },
  interests: {
    type: 'strings'
  },
  links: {

  },
  imageURL: {

  },
  coverURL: {

  },
};

export interface UserInfo {
  id: string;
  followercount: number;
  followingcount: number;
}
export interface UserInfoFilter extends Filter {
  id?: string;
  followercount?: number;
  followingcount?: number;
}

export const userInfoModel: Attributes = {
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
}
export interface UserInfoQuery extends Query<UserInfo, string, UserInfoFilter> {
  // getFollow(id: string): Promise<UserInfo[]>;
}
export interface UserInfoRepository extends Repository<UserInfo, string> {

}