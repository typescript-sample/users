import { uploadModel } from 'one-storage';
import { Attributes, DateRange, Filter, Repository } from 'onecore';
import { UploadData } from 'upload-express';
import { Company, Education, Work } from 'user';

export interface User {
  id: string;
  username: string;
  email?: string;
  phone?: string;
  dateOfBirth?: Date;
  interests: string[];
  skills: Skill[];
  achievements: Achievement[];
  settings?: UserSettings;
  title?: string;
  image?: UploadSize[];
  coverURL?: string;
  nationality?: string;
  alternativeEmail?: string;
  address?: string;
  bio?: string;
  website?: string;
  occupation?: string;
  company?: string;
  lookingFor?: string[];
  gallery?: UploadInfo[];
  imageURL?: string;
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
export interface Skill {
  skill: string;
  hirable: boolean;
}
export interface UserSettings {
  language: string;
  dateFormat: string;
  dateTimeFormat: string;
  timeFormat: string;
  notification: boolean;
}
export interface Achievement {
  subject: string;
  description: string;
}
export interface Appreciation {
  id: string;
  userId: string;
  appreciator: string;
  appreciatedAt: string;
  subject: string;
  description: string;
}

export interface UploadInfo {
  source?: string;
  type?: string;
  url: string;
}

export interface UploadSize {
  size: string;
  url: string;
}
export interface FileUploadsCover {
  source: string;
  url: string;
}

export interface UploadGallery {
  id: string;
  source?: string;
  name: string;
  data: Buffer;
  type: string;
}
export interface UserFilter extends Filter {
  id: string;
  username: string;
  email?: string;
  phone?: string;
  dateOfBirth?: DateRange;
  interests: string[];
  skills: Skill[];
  achievements: Achievement[];
}
export interface UserRepository extends Repository<User, string> { }
export interface MyProfileService {
  getMyProfile(id: string): Promise<User | null>;
  getMySettings(id: string): Promise<UserSettings | null>;
  saveMyProfile(user: User): Promise<number>;
  saveMySettings(id: string, settings: UserSettings): Promise<number>;
}
export interface MyProfileServiceUpload {
  uploadCoverImage(id: string, data: UploadData[], sizes?: number[]): Promise<string>;
  uploadImage(id: string, data: UploadData[], sizes?: number[]): Promise<string>;
  uploadGalleryFile(uploadGallery: UploadGallery): Promise<UploadInfo[]>;
  updateGallery(id: string, data: UploadInfo[]): Promise<boolean>;
  deleteGalleryFile(id: string, url: string): Promise<boolean>;
  getGalllery(id: string): Promise<UploadInfo[]>;
  addExternalResource(id: string, data: UploadInfo): Promise<boolean>;
  deleteExternalResource(id: string, url: string): Promise<boolean>;
}

export const skillsModel: Attributes = {
  skill: {
    required: true,
  },
  hirable: {
    type: 'boolean',
  },
};
export const companiesModel: Attributes = {
  description: {
    type: 'string',

  },
  from: {
    type: 'string',

  },
  name: {
    type: 'string',

  },
  position: {
    type: 'string',
  },
  to: {
    type: 'string',
  },
};
export const achievementsModel: Attributes = {
  description: {
    type: 'string',

  },
  highlight: {
    type: 'boolean',

  },
  subject: {
    type: 'string',
  }
};
export const educationsModel: Attributes = {
  from: {
    type: 'string',
  },
  to: {
    type: 'boolean',

  },
  major: {
    type: 'string',
  },
  title: {
    type: 'string'
  },
  degree: {
    type: 'string'
  },
  school: {
    type: 'string'
  }
};
export const fileUploadModel: Attributes = {
  url: {
    required: true,
  },
  source: {
    required: true,
  },
};

export const userSettingsModel: Attributes = {
  userId: {},
  language: {},
  dateFormat: {},
  dateTimeFormat: {},
  timeFormat: {},
  notification: {
    type: 'boolean',
  },
};
export const userModel: Attributes = {
  id: {
    key: true,
    match: 'equal',
  },
  username: {},
  email: {
    format: 'email',
    required: true,
    match: 'prefix',
  },
  phone: {
    format: 'phone',
    required: true,
  },
  dateOfBirth: {
    type: 'datetime',
  },
  interests: {
    type: 'primitives',
  },
  skills: {
    type: 'primitives',
    typeof: skillsModel,
  },
  settings: {
    type: 'object',
    typeof: userSettingsModel,
  },
  bio: {
  },
  coverURL: {
    type: 'string',
  },
  imageURL: {
    type: 'string',
  },
  familyName: {
    type: 'string',
  },
  givenName: {
    type: 'string',
  },
  displayname: {
    type: 'string',
  },
  occupation: {
    type: 'string',
  },
  website: {
    type: 'string',
  },
  gallery: {
    type: 'array',
    typeof: uploadModel,
  },
  links: {
    type: 'object',
  },
  lookingFor: {
    type: 'strings',
  },
  company: {
    type: 'strings',
  },
  companies: {
    type: 'primitives',
    typeof: companiesModel
  },
  achievements: {
    type: 'primitives',
    typeof: achievementsModel
  },
  educations: {
    type: 'primitives',
    typeof: educationsModel
  },
  works: {

  }
};
