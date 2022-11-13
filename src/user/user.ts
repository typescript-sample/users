import { Attributes, DateRange, Filter, Info10, Query, Repository, ViewRepository } from 'onecore'

export interface UserFilter extends Filter {
  id?: string
  username?: string
  email?: string
  phone?: string
  dateOfBirth?: DateRange
  interests?: string[]
  skills?: Skill[]
} // End of UserFilter

export interface Skill {
  skill: string
  hirable?: boolean
} // End of Skill

export interface Work {
  name: string
  position: string
  description: string
  item: string[]
  from: Date
  to: Date
} // End of Work

export interface Company {
  id?: string
  name: string
  position: string
  descrition: string
  from: Date
  to: Date
} // Company

export interface Education {
  school: string
  degree: string
  major: string
  title: string
  from: Date
  to: Date
} // Education

export interface User {
  id?: string
  username?: string
  email?: string
  phone?: string
  dateOfBirth?: string
  links?: Social
  works: Work[]
  companies: Company[]
  educations: Education[]
  info?: Info10
} // User

export interface Social {
  google: string
  facebook: string
  github: string
  instagram: string
  twitter: string
  skype: string
  dribble: string
  linkedin: string
} // End of Social

export interface UserInfo {
  id: string
  followercount: number
  followingcount: number
} // End of UserInfo

export interface UserInfoFilter extends Filter {
  id?: string
  followercount?: number
  followingcount?: number
} // End of UserInfoFilter

export interface UserRepository extends ViewRepository<User, string> {
  getUsersByCompany(companyId: string): Promise<User[]>
} // End of UserRepository

export interface UserService extends Query<User, string, UserFilter> {
  getUsersByCompany(companyId: string): Promise<User[]>
} // End of UserService

export interface UserInfoQuery extends Query<UserInfo, string, UserInfoFilter> {
} // End of UserInfoQuery

export interface UserInfoRepository extends Repository<UserInfo, string> {
} // End of UserInfoRepository

export const userModel: Attributes = {
  id: {
    key: true,
    length: 40
  },
  username: {
    length: 120
  },
  email: {
    length: 120
  },
  phone: {
    length: 45
  },
  dateOfBirth: {
    type: 'datetime'
  },
  interests: {
    type: 'strings'
  },
  links: {},
  imageURL: {},
  coverURL: {}
} // End of userModel

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
} // End of userInfoModel
