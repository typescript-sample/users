import { Attributes, DateRange, Filter, ViewRepository, ViewService } from 'onecore';

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
export interface User {
  id?: string;
  username?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  links?: Social
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
  links:{

  },
  imageURL:{

  },
  coverURL:{
    
  }
};
