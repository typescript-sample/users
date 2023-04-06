import { Storage } from '@google-cloud/storage';
import { AuthenticationController } from 'authen-express';
import {
  Authenticator,
  CodeMailSender,
  initializeStatus,
  SqlAuthTemplateConfig,
  User,
  useUserRepository,
} from 'authen-service';
import { compare } from 'bcrypt';
import { Comparator } from 'bcrypt-plus';
import { CommentReactionController, CommentThread, CommentThreadFilter } from 'comment-thread';
import { CommentThreadController } from 'comment-thread/comment-thread';
import {
  HealthController,
  ItemController as ItemsController,
  LogController,
  Logger,
  Middleware,
  MiddlewareController,
  ModelConfig,
  resources
} from 'express-ext';
import {
  Controller,
  FollowController,
  Query,
  QueryController,
  RateController,
  ReactionController,
  SavedController,
  UploadController,
  UserReactionController
} from 'express-types';
import {
  deleteFile,
  GoogleStorageRepository,
  map,
  StorageConfig,
  useBuildUrl,
} from 'google-storage';
import { generateToken } from 'jsonwebtoken-plus';
import { MailConfig, MailService, Send } from 'mail-core';
import { MiddlewareAuth } from './middleware/auth';
import nodemailer from 'nodemailer';
import { ModelConf, StorageConf } from 'one-storage';
import { PasswordController } from 'password-express';
import { MailSender, PasswordService, PasswordTemplateConfig, usePasswordRepository } from 'password-service';
import { CodeRepository, DB, StringService } from 'pg-extension';
import { createChecker, Repository } from 'query-core';
import { TemplateMap } from 'query-mappers';
import { SendGridMailService } from 'sendgrid-plus';
import shortid from 'shortid';
import { SignupController } from 'signup-express';
import {
  initStatus,
  Signup,
  SignupSender,
  SignupService,
  SignupTemplateConfig,
  useRepository,
  Validator,
} from 'signup-service';
import { createValidator } from 'xvalidators';
import { useAppreciationCommentController, useAppreciationController, useAppreciationReactionController } from './appreciation';
import { AppreciationController } from './appreciation';
import {
  useArticleCommentReactionController,
  useArticleCommentThreadController, useArticleCommentThreadReactionController, useArticleController,
  useArticleRateCommentController,
  useArticleRateController,
  useArticleReactionController
} from './article';
import { useBackOfficeCinemaController, useCinemaUploadController } from './backoffice/cinema';
import { BackOfficeCompanyController, useBackOfficeCompanyController, useCompanyUploadController } from './backoffice/company';
import { useBackOfficeFilmController, useFilmUploadController } from './backoffice/film';
import { useBackOfficeJobController } from './backoffice/job';
import { useBackOfficeLocationController, useLocationUploadController } from './backoffice/location';
import { useBackOfficeMusicController } from './backoffice/music';
import { useBackOfficeRoomController } from './backoffice/room';
import { useCompanyCategoryController, useFilmCategoryController, useItemCategoryController } from './category';
import {
  useCinemaController,
  useCinemaRateCommentController,
  useCinemaRateController,
  useCinemaReactionController,
} from './cinema';
import { useCommentController } from './comment';
import {
  CompanyController,
  useCompanyController,
  useCompanyRateCommentController,
  useCompanyRateController,
  useCompanyRateReactionController
} from './company';
import {
  useFilmReplyCommentReactionController,
  useFilmCommentThreadController,
  useFilmCommentThreadReactionController,
  useFilmController,
  useFilmRateCommentController,
  useFilmRateController,
  useFilmReactionController,
  useSavedFilmsController,
} from './film';
import { useItemController } from './items';
import { useSavedController } from './items';
import { ResponseController, useResponseController, useResponseReactionController } from './items-response';
import { useJobController } from './job';
import {
  useLocationCommentReactionController,
  useLocationCommentThreadController,
  useLocationCommentThreadReactionController,
  useLocationController,
  useLocationFollowController,
  useLocationInfomationController,
  useLocationRateCommentController,
  useLocationRateController,
  useLocationReactionController,
  useSavedLocationController
} from './location';
import { useMusicController, usePlaylistController, useSavedListSongController, useSavedMusicsController } from './music';
import { useMyArticleController } from './my-articles';
import { MyItemController, useMyItemController, useMyItemUploadController } from './my-items';
import { MyProfileController, useMyProfileController, useMyProfileUploadController, userModel, UserSettings, User as Profile } from './my-profile';
import { RoomController, useRoomController } from './room';
import { UserController, useReactionController, useUserInfoController, useUserRateCommentController, useUserRateController, useUserReactionController } from './user';
import { useUserController, useUserFollowController } from './user';

resources.createValidator = createValidator;

export interface Config {
  cookie?: boolean;
  secret: string;
  auth: SqlAuthTemplateConfig;
  signup: SignupTemplateConfig;
  password: PasswordTemplateConfig;
  mail: MailConfig;
  settings: UserSettings;
  bucket: string;
  storage: StorageConf;
  model: ModelConf;
  modelAppreciation: ModelConfig;
  modelItem: ModelConf;
} // End of Config

export interface ApplicationContext {
  health: HealthController;
  log: LogController;
  middleware: MiddlewareController;
  authMiddleware: MiddlewareAuth;
  authentication: AuthenticationController<User, string>;
  signup: SignupController<Signup>;
  password: PasswordController;
  myprofile: MyProfileController;
  myprofileUpload: UploadController;
  user: UserController;
  userFollow: FollowController;
  reaction: UserReactionController;
  userInfo: QueryController;
  locationInfomation: QueryController;
  skill: Query;
  interest: Query;
  lookingFor: Query;
  educationQuery: Query;
  companyQuery: Query;

  appreciation: AppreciationController;
  appreciationComment: QueryController;
  appreciationReaction: ReactionController;

  article: QueryController;
  articleRate: RateController;
  articleReaction: ReactionController;
  articleRateComment: QueryController;

  myarticles: Controller;
  cinema: QueryController;
  backofficeCinema: Controller;
  backofficeCinemaUpload: UploadController;
  cinemaRate: RateController;
  cinemaReaction: ReactionController;
  cinemaComment: QueryController;
  company: CompanyController;
  backofficeCompany: BackOfficeCompanyController;
  backofficeCompanyUpload: UploadController;
  companyCategory: Controller;
  comment: Controller;
  film: QueryController;
  backOfficeFilm: Controller;
  filmRate: RateController;
  filmReaction: ReactionController;
  filmComment: QueryController;
  filmCommentThread: CommentThreadController
  filmCommentThreadReaction: CommentReactionController;
  filmCommentReplyReaction: CommentReactionController;
  userRate: RateController;
  userReaction: ReactionController;
  userComment: QueryController;
  filmCategory: Controller;
  backOfficeFilmUpload: UploadController;
  director: Query;
  cast: Query;
  production: Query;
  country: Query;
  items: QueryController;
  brand: Query;
  itemCategory: Controller;
  itemResponse: ResponseController;
  itemReaction: ReactionController;
  myitems: MyItemController;
  myitemsUpload: UploadController;
  location: QueryController;
  backofficeLocation: Controller;
  backofficeLocationUpload: UploadController;
  locationRate: RateController;
  locationCommentThread: CommentThreadController
  locationCommentThreadReaction: CommentReactionController;
  locationCommentReaction: CommentReactionController;
  locationReaction: ReactionController;
  locationComment: QueryController;
  locationFollow: FollowController;
  jobs: QueryController;
  room: RoomController;
  backofficeJob: Controller;
  saveItem: SavedController;
  saveLocation: SavedController;
  saveFilm: SavedController;
  saveMusic: SavedController;
  saveListsong: SavedController;
  criteriaReaction: ReactionController;
  criteriaRate: RateController;
  criteriaComment: QueryController;
  backofficeRoom: Controller;
  music: QueryController;
  backofficeMusic: Controller;
  playlist: Controller;
  articleCommentThread: CommentThreadController;
  articleCommentThreadReaction: CommentReactionController;
  articleCommentReaction: CommentReactionController;
} // End of ApplicationContext

export function useContext(
  mainDB: DB,
  queryDB: DB,
  logger: Logger,
  midLogger: Middleware,
  conf: Config,
  mapper?: TemplateMap
): ApplicationContext {
  const log = new LogController(logger);
  const middleware = new MiddlewareController(midLogger);
  const authMiddleware = new MiddlewareAuth(conf.auth.token.secret)
  const sqlChecker = createChecker(mainDB);
  const health = new HealthController([sqlChecker]);
  const sendMail = useSend(conf.mail);
  const comparator = new Comparator();

  // const encrypter = new RC4Encrypter(conf.secret);
  const auth = conf.auth;
  const status = initializeStatus(conf.auth.status);
  const codeMailSender = new CodeMailSender(
    sendMail,
    conf.mail.from,
    conf.auth.template.body,
    conf.auth.template.subject
  );
  const verifiedCodeRepository = new CodeRepository<string>(mainDB, 'authencodes');
  const userRepository = useUserRepository<string, SqlAuthTemplateConfig>(queryDB, conf.auth);
  const authenticator = new Authenticator(
    status,
    compare,
    generateToken,
    auth.token,
    auth.payload,
    auth.account,
    userRepository,
    undefined,
    auth.lockedMinutes,
    2,
    codeMailSender.send,
    conf.auth.expires,
    verifiedCodeRepository,
    comparator.hash
  );
  const authentication = new AuthenticationController(logger.error, authenticator.authenticate, conf.cookie);

  const signupMailSender = new SignupSender(
    conf.signup.url,
    sendMail,
    conf.mail.from,
    conf.signup.template.body,
    conf.signup.template.subject
  );
  const passcodeRepository = new CodeRepository<string>(mainDB, 'signupcodes');
  const signupRepository = useRepository<string, Signup>(
    mainDB,
    'users',
    'passwords',
    conf.signup.userStatus,
    conf.signup.fields,
    conf.signup.maxPasswordAge,
    conf.signup.track,
    conf.signup.map
  );
  const validator = new Validator();
  const signupStatus = initStatus(conf.signup.status);
  const signupService = new SignupService<string, Signup>(
    signupStatus,
    signupRepository,
    generate,
    comparator,
    comparator,
    passcodeRepository,
    signupMailSender.send,
    conf.signup.expires,
    validator.validate
  );
  const signup = new SignupController(logger.error, signupService);

  const passwordMailSender = new MailSender(
    sendMail,
    conf.mail.from,
    conf.password.templates.reset.body,
    conf.password.templates.reset.subject
  );
  const codeRepository = new CodeRepository<string>(mainDB, 'passwordcodes');
  const passwordRepository = usePasswordRepository<string>(
    mainDB,
    conf.password.db,
    conf.password.max,
    conf.password.fields
  );
  const passwordService = new PasswordService<string>(
    comparator,
    passwordRepository,
    passwordMailSender.send,
    conf.password.expires,
    codeRepository,
    conf.password.max,
    undefined
  );
  const password = new PasswordController(logger.error, passwordService);

  const user = useUserController(logger.error, mainDB);
  const reaction = useReactionController(logger.error, mainDB);
  const userFollow = useUserFollowController(logger.error, mainDB);
  const userInfo = useUserInfoController(logger.error, mainDB, mapper);
  const locationInfomation = useLocationInfomationController(logger.error, mainDB, mapper);

  const skillService = new StringService('skill', 'skill', queryDB.query, queryDB.exec);
  const skill = new ItemsController<string[]>(logger.error, skillService.load, 'keyword');
  const interestService = new StringService('interest', 'interest', queryDB.query, queryDB.exec);
  const interest = new ItemsController<string[]>(logger.error, interestService.load, 'keyword');
  const lookingForService = new StringService('search', 'item', queryDB.query, queryDB.exec);
  const lookingFor = new ItemsController<string[]>(logger.error, interestService.load, 'keyword');
  const companyService = new StringService('user_companies', 'company', queryDB.query, queryDB.exec);
  const companyQuery = new ItemsController<string[]>(logger.error, companyService.load, 'keyword');
  const educationService = new StringService('educations', 'school', queryDB.query, queryDB.exec);
  const educationQuery = new ItemsController<string[]>(logger.error, educationService.load, 'keyword');
  const appreciation = useAppreciationController(logger.error, mainDB);
  const appreciationComment = useAppreciationCommentController(logger.error, mainDB);
  const appreciationReaction = useAppreciationReactionController(logger.error, mainDB, generate);
  const storageConfig: StorageConfig = { bucket: conf.bucket, public: true };
  const storage = new Storage();
  const bucket = storage.bucket(conf.bucket);
  const storageRepository = new GoogleStorageRepository(bucket, storageConfig, map);
  const sizesCover: number[] = [576, 768];
  const sizesImage: number[] = [40, 400];
  const repository = new Repository<Profile, string>(mainDB, 'users', userModel);
  const myprofile = useMyProfileController(
    logger.error,
    repository,
    conf.settings,
    skillService.save,
    interestService.save,
    lookingForService.save,
    educationService.save,
    companyService.save,
  );
  const myprofileUpload = useMyProfileUploadController(
    logger.error,
    repository,
    storageRepository,
    deleteFile,
    generate,
    useBuildUrl(conf.bucket),
    sizesCover,
    sizesImage,
    undefined,
    conf.model
  );
  const article = useArticleController(logger.error, mainDB);
  const articleRate = useArticleRateController(logger.error, queryDB, mapper);
  const articleReaction = useArticleReactionController(logger.error, queryDB, mapper);
  const articleRateComment = useArticleRateCommentController(logger.error, queryDB, mapper);
  const articleCommentThread = useArticleCommentThreadController(logger.error, mainDB, mapper);
  const articleCommentThreadReaction = useArticleCommentThreadReactionController(logger.error, mainDB, mapper)
  const articleCommentReaction = useArticleCommentReactionController(logger.error, mainDB, mapper)
  const myarticles = useMyArticleController(logger.error, queryDB, mapper);

  const company = useCompanyController(logger.error, queryDB);
  const backofficeCompany = useBackOfficeCompanyController(logger.error, queryDB);
  const backofficeCompanyUpload = useCompanyUploadController(
    logger.error,
    queryDB,
    storageRepository,
    deleteFile,
    generate,
    useBuildUrl(conf.bucket),
    [],
    [],
    undefined,
    conf.modelItem,
    mapper
  );
  const companyCategory = useCompanyCategoryController(logger.error, queryDB, mapper);

  const cinema = useCinemaController(logger.error, queryDB, mapper);
  const cinemaRate = useCinemaRateController(logger.error, queryDB, mapper);
  const cinemaReaction = useCinemaReactionController(logger.error, queryDB, mapper);
  const cinemaComment = useCinemaRateCommentController(logger.error, queryDB, mapper);

  const backofficeCinema = useBackOfficeCinemaController(logger.error, queryDB, mapper);
  const backofficeCinemaUpload = useCinemaUploadController(
    logger.error,
    queryDB,
    storageRepository,
    deleteFile,
    generate,
    useBuildUrl(conf.bucket),
    [],
    [],
    undefined,
    conf.modelItem,
    mapper
  );

  const saveItem = useSavedController(logger.error, queryDB);
  const saveLocation = useSavedLocationController(logger.error, queryDB);
  const saveFilm = useSavedFilmsController(logger.error, queryDB);
  const saveMusic = useSavedMusicsController(logger.error, queryDB);
  const saveListsong = useSavedListSongController(logger.error, queryDB);

  const directorService = new StringService('filmdirector', 'director', queryDB.query, queryDB.exec);
  const director = new ItemsController<string[]>(logger.error, directorService.load, 'keyword');
  const castService = new StringService('casts', 'actor', queryDB.query, queryDB.exec);
  const cast = new ItemsController<string[]>(logger.error, castService.load, 'keyword');
  const productionService = new StringService('filmproduction', 'production', queryDB.query, queryDB.exec);
  const production = new ItemsController<string[]>(logger.error, productionService.load, 'keyword');
  const countryService = new StringService('filmcountry', 'country', queryDB.query, queryDB.exec);
  const country = new ItemsController<string[]>(logger.error, countryService.load, 'keyword');
  const film = useFilmController(logger.error, queryDB, mapper);
  const backOfficeFilm = useBackOfficeFilmController(
    logger.error,
    queryDB,
    directorService.save,
    castService.save,
    productionService.save,
    countryService.save,
    mapper
  );
  const filmRate = useFilmRateController(logger.error, queryDB, mapper);
  const filmReaction = useFilmReactionController(logger.error, queryDB, mapper);
  const filmComment = useFilmRateCommentController(
    logger.error,
    queryDB,
    mapper
  );
  const filmCommentThread = useFilmCommentThreadController(logger.error, mainDB, mapper);
  const filmCommentThreadReaction = useFilmCommentThreadReactionController(logger.error, mainDB, mapper)
  const filmCommentReplyReaction = useFilmReplyCommentReactionController(logger.error, mainDB, mapper)
  const userRate = useUserRateController(logger.error, queryDB, mapper);
  const userReaction = useUserReactionController(logger.error, queryDB, mapper);
  const userComment = useUserRateCommentController(
    logger.error,
    queryDB,
    mapper
  );
  const filmCategory = useFilmCategoryController(logger.error, queryDB, mapper);

  const backOfficeFilmUpload = useFilmUploadController(
    logger.error,
    queryDB,
    storageRepository,
    deleteFile,
    generate,
    useBuildUrl(conf.bucket),
    [],
    [],
    undefined,
    conf.modelItem,
    mapper
  );

  const backofficeLocation = useBackOfficeLocationController(logger.error, queryDB, mapper);
  const backofficeLocationUpload = useLocationUploadController(
    logger.error,
    queryDB,
    storageRepository,
    deleteFile,
    generate,
    useBuildUrl(conf.bucket),
    [],
    [],
    undefined,
    conf.modelItem,
    mapper
  );

  const location = useLocationController(logger.error, queryDB, mapper);
  const locationCommentThread = useLocationCommentThreadController(logger.error, mainDB, mapper);
  const locationCommentThreadReaction = useLocationCommentThreadReactionController(logger.error, mainDB, mapper)
  const locationCommentReaction = useLocationCommentReactionController(logger.error, mainDB, mapper)
  const locationRate = useLocationRateController(logger.error, queryDB, mapper);
  const locationReaction = useLocationReactionController(logger.error, queryDB, mapper);
  const locationComment = useLocationRateCommentController(logger.error, queryDB, mapper);
  const locationFollow = useLocationFollowController(logger.error, queryDB);

  const items = useItemController(logger.error, queryDB);
  const itemResponse = useResponseController(logger.error, queryDB, mapper);
  const itemReaction = useResponseReactionController(logger.error, queryDB, mapper);
  const itemCategory = useItemCategoryController(logger.error, queryDB, mapper);
  const brandService = new StringService('brand', 'brand', queryDB.query, queryDB.exec);
  const brand = new ItemsController<string[]>(logger.error, brandService.load, 'keyword');
  const myitems = useMyItemController(
    logger.error,
    queryDB,
    storageRepository,
    brandService.save,
    deleteFile,
    generate,
    useBuildUrl(conf.bucket),
    [],
    [],
    undefined,
    conf.modelItem,
    mapper
  );
  const myitemsUpload = useMyItemUploadController(
    logger.error,
    queryDB,
    storageRepository,
    brandService.save,
    deleteFile,
    generate,
    useBuildUrl(conf.bucket),
    [],
    [],
    undefined,
    conf.modelItem,
    mapper
  );
  const comment = useCommentController(logger.error, queryDB, mapper);
  const jobs = useJobController(logger.error, mainDB, mapper);
  const room = useRoomController(logger.error, mainDB, mapper);
  const backofficeJob = useBackOfficeJobController(logger.error, mainDB, mapper);
  const backofficeRoom = useBackOfficeRoomController(logger.error, mainDB, mapper);
  const music = useMusicController(logger.error, mainDB, mapper);
  const backofficeMusic = useBackOfficeMusicController(logger.error, mainDB, mapper);

  const playlist = usePlaylistController(logger.error, mainDB, mapper);
  // company-rate
  const criteriaRate = useCompanyRateController(logger.error, queryDB, mapper);
  const criteriaReaction = useCompanyRateReactionController(logger.error, queryDB, mapper);
  const criteriaComment = useCompanyRateCommentController(logger.error, queryDB, mapper);

  return {
    health,
    log,
    middleware,
    authMiddleware,
    authentication,
    signup,
    password,
    myprofile,
    myprofileUpload,
    user,
    reaction,
    userFollow,
    skill,
    interest,
    lookingFor,
    educationQuery,
    companyQuery,
    appreciation,
    appreciationComment,
    appreciationReaction,
    comment,
    cinema,
    cinemaRate,
    cinemaReaction,
    cinemaComment,
    company,
    companyCategory,
    film,
    filmRate,
    filmReaction,
    filmComment,
    filmCommentThread,
    filmCommentThreadReaction,
    filmCommentReplyReaction,
    userRate,
    userReaction,
    userComment,
    filmCategory,
    backOfficeFilmUpload,
    director,
    cast,
    production,
    country,
    location,
    locationRate,
    locationCommentThread,
    locationCommentThreadReaction,
    locationCommentReaction,
    locationReaction,
    locationComment,
    articleRate,
    articleRateComment,
    articleReaction,
    myarticles,
    items,
    itemCategory,
    itemResponse,
    itemReaction,
    brand,
    myitems,
    myitemsUpload,
    jobs,
    criteriaRate,
    criteriaReaction,
    criteriaComment,
    backOfficeFilm,
    backofficeCompany,
    backofficeCompanyUpload,
    backofficeJob,
    backofficeLocation,
    backofficeLocationUpload,
    backofficeCinema,
    backofficeCinemaUpload,
    saveItem,
    locationFollow,
    userInfo,
    saveLocation,
    locationInfomation,
    saveFilm,
    backofficeRoom,
    music,
    backofficeMusic,
    room,
    saveMusic,
    playlist,
    saveListsong,
    article,
    articleCommentThread,
    articleCommentThreadReaction,
    articleCommentReaction
  };
}

export function generate(): string {
  return shortid.generate();
}
export function hasTwoFactors(userId: string): Promise<boolean> {
  return Promise.resolve(false);
}
export function useSend(conf: MailConfig): Send {
  if (conf.provider === 'sendgrid') {
    return new SendGridMailService(conf.key).send;
  } else {
    const transporter = nodemailer.createTransport(conf.smtp);
    return new MailService(transporter).send;
  }
}