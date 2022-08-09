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
import {
  HealthController,
  LogController,
  Logger,
  Middleware,
  MiddlewareController,
  ModelConfig,
  ItemController as ItemsController,
  resources,
  useBuild,
  SavedController,
} from 'express-ext';
import {
  deleteFile,
  GoogleStorageRepository,
  map,
  StorageConfig,
  useBuildUrl,
} from 'google-storage';
import { generateToken } from 'jsonwebtoken-plus';
import { MailConfig, MailService, Send } from 'mail-core';
import { MyItemUploadController } from 'my-items/item-controller';
import nodemailer from 'nodemailer';
import { ModelConf, StorageConf } from 'one-storage';
import { PasswordController } from 'password-express';
import {
  MailSender,
  PasswordService,
  PasswordTemplateConfig,
  usePasswordRepository,
} from 'password-service';
import { CodeRepository, DB, StringService } from 'pg-extension';
import { createChecker } from 'query-core';
import { TemplateMap } from 'query-mappers';
import { Rate, RateFilter } from 'rate-core';
import { Comment } from 'review-reaction';
import { RateCommentController, RateController, ReactionController } from 'review-reaction-express';
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
import {
  AppreciationController,
  useAppreciationController,
} from './appreciation';
import { ArticleController, useArticleController } from './article';
import {
  BackOfficeCompanyController,
  useBackOfficeCompanyController
} from './backoffice/company';
import {
  BackOfficeFilmController,
  useBackOfficeFilmController
} from './backoffice/film';
import { BackOfficeJobController, useBackOfficeJobController } from './backoffice/job';
import {
  BackOfficeLocationController,
  useBackOfficeLocationController
} from './backoffice/location';
import {
  CategoryController,
  useCompanyCategoryController,
  useFilmCategoryController,
  useItemCategoryController,
} from './category';
import {
  CinemaController,
  useCinemaController,
  useCinemaRateCommentController,
  useCinemaRateController,
  useCinemaReactionController,
} from "./cinema";
import {
  BackOfficeCinemaController,
  useBackOfficeCinemaController
} from "./backoffice/cinema";
import { CommentController, useCommentController } from "./comment";
import {
  CompanyController,
  useCompanyController
} from './company';
import { useCompanyRateCommentController, useCompanyRateController, useCompanyRateReactionController } from './company';
import { RateCriteria, RateCriteriaFilter } from './company/company';
import {
  FilmController,
  useFilmController,
  useFilmRateCommentController,
  useFilmRateController,
  useFilmReactionController,
} from './film';
import { Item, ItemController, useItemController } from './items';
import {
  Response,
  ResponseController,
  ResponseFilter,
  useResponseController,
  useResponseReactionController,
} from './items-response';
import { JobController, useJobController } from './job';
import {
  LocationController,
  useLocationController,
  useLocationRateCommentController,
  useLocationRateController,
  useLocationReactionController,
} from './location';
import {
  ArticleController as MyArticleController,
  useMyArticleController,
} from './my-articles';
import {
  MyItemController,
  useMyItemController,
  useMyItemUploadController,
} from './my-items';
import {
  MyProfileController,
  useMyProfileController,
  UserSettings,
} from './my-profile';
import { UserController, useUserController } from './user';

import {useSavedController} from './items'
import { Request, Response as Res } from 'express';
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
}
export interface QueryController {
  search(req: Request, res: Res): void;
}
export interface ApplicationContext {
  health: HealthController;
  log: LogController;
  middleware: MiddlewareController;
  authentication: AuthenticationController<User, string>;
  signup: SignupController<Signup>;
  password: PasswordController;
  myprofile: MyProfileController;
  user: UserController;
  skill: ItemsController<string[]>;
  interest: ItemsController<string[]>;
  lookingFor: ItemsController<string[]>;
  educationQuery: ItemsController<string[]>;
  companyQuery: ItemsController<string[]>;
  appreciation: AppreciationController;
  // appreciationReply: ReplyController;
  article: ArticleController;
  myarticles: MyArticleController;
  cinema: CinemaController;
  backofficeCinema: BackOfficeCinemaController;
  cinemaRate: RateController<Rate>;
  cinemaReaction: ReactionController<Rate, RateFilter, Comment>;
  cinemaComment: RateCommentController<Comment>;
  company: CompanyController;
  backofficeCompany: BackOfficeCompanyController;
  // companyRate: RateController<Rate>;
  // companyReaction: ReactionController<Rate, RateFilter, Comment>;
  // companyComment: RateCommentController<Comment>;
  companyCategory: CategoryController;
  comment: CommentController;
  film: FilmController;
  backOfficeFilm: BackOfficeFilmController;
  filmRate: RateController<Rate>;
  filmReaction: ReactionController<Rate, RateFilter, Comment>;
  filmComment: RateCommentController<Comment>;
  filmCategory: CategoryController;
  director: ItemsController<string[]>;
  cast: ItemsController<string[]>;
  production: ItemsController<string[]>;
  country: ItemsController<string[]>;
  items: ItemController;
  brand: ItemsController<string[]>;
  itemCategory: CategoryController;
  itemResponse: ResponseController;
  itemReaction: ReactionController<Response, ResponseFilter, Comment>;
  myitems: MyItemController;
  myitemsUpload: MyItemUploadController;
  location: LocationController;
  backofficeLocation: BackOfficeLocationController;
  locationRate: RateController<Rate>;
  locationReaction: ReactionController<Rate, RateFilter, Comment>;
  locationComment: RateCommentController<Comment>;
  jobs: JobController;
  backofficeJob: BackOfficeJobController;
  criteriaReaction: ReactionController<RateCriteria, RateCriteriaFilter, Comment>;
  criteriaRate: RateController<RateCriteria>;
  criteriaComment: RateCommentController<Comment>;
  saveItem: SavedController<Item>;
}

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
  const verifiedCodeRepository = new CodeRepository<string>(
    mainDB,
    'authencodes'
  );
  const userRepository = useUserRepository<string, SqlAuthTemplateConfig>(
    queryDB,
    conf.auth
  );
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
  const authentication = new AuthenticationController(
    logger.error,
    authenticator.authenticate,
    conf.cookie
  );

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
  const build = useBuild(conf.modelAppreciation, generate);
  const password = new PasswordController(logger.error, passwordService);

  const user = useUserController(logger.error, mainDB);

  const skillService = new StringService(
    'skill',
    'skill',
    queryDB.query,
    queryDB.exec
  );
  const skill = new ItemsController<string[]>(
    logger.error,
    skillService.load,
    'keyword'
  );
  const interestService = new StringService(
    'interest',
    'interest',
    queryDB.query,
    queryDB.exec
  );
  const interest = new ItemsController<string[]>(
    logger.error,
    interestService.load,
    'keyword'
  );
  const lookingForService = new StringService(
    'search',
    'item',
    queryDB.query,
    queryDB.exec
  );
  const lookingFor = new ItemsController<string[]>(
    logger.error,
    interestService.load,
    'keyword'
  );
  const companyService = new StringService(
    'user_companies',
    'company',
    queryDB.query,
    queryDB.exec
  );
  const companyQuery = new ItemsController<string[]>(
    logger.error,
    companyService.load,
    'keyword'
  );
  const educationService = new StringService(
    'educations',
    'school',
    queryDB.query,
    queryDB.exec
  );
  const educationQuery = new ItemsController<string[]>(
    logger.error,
    educationService.load,
    'keyword'
  );
  const appreciation = useAppreciationController(logger.error, mainDB);
  // const appreciationReply = useAppreciationReplyController(
  //   logger.error,
  //   mainDB,
  //   undefined,
  //   build
  // );

  const storageConfig: StorageConfig = { bucket: conf.bucket, public: true };
  const storage = new Storage();
  const bucket = storage.bucket(conf.bucket);
  const storageRepository = new GoogleStorageRepository(
    bucket,
    storageConfig,
    map
  );
  const sizesCover: number[] = [576, 768];
  const sizesImage: number[] = [40, 400];
  const myprofile = useMyProfileController(
    logger.error,
    mainDB,
    conf.settings,
    storageRepository,
    deleteFile,
    generate,
    useBuildUrl(conf.bucket),
    skillService.save,
    interestService.save,
    lookingForService.save,
    educationService.save,
    companyService.save,
    sizesCover,
    sizesImage,
    undefined,
    conf.model
  );
  const article = useArticleController(logger.error, mainDB);
  const myarticles = useMyArticleController(logger.error, queryDB, mapper);

  const company = useCompanyController(logger.error, queryDB);
  const backofficeCompany = useBackOfficeCompanyController(logger.error, queryDB);
  const companyCategory = useCompanyCategoryController(
    logger.error,
    queryDB,
    mapper
  );

  const cinema = useCinemaController(logger.error, queryDB, mapper);
  const cinemaRate = useCinemaRateController(logger.error, queryDB, mapper);
  const cinemaReaction = useCinemaReactionController(logger.error, queryDB, mapper);
  const cinemaComment = useCinemaRateCommentController(logger.error,queryDB,mapper);

  const backofficeCinema = useBackOfficeCinemaController(logger.error, queryDB, mapper);

  const saveItem=useSavedController(logger.error, queryDB)

  const directorService = new StringService(
    'filmdirector',
    'director',
    queryDB.query,
    queryDB.exec
  );
  const director = new ItemsController<string[]>(
    logger.error,
    directorService.load,
    'keyword'
  );
  const castService = new StringService(
    'filmcast',
    'actor',
    queryDB.query,
    queryDB.exec
  );
  const cast = new ItemsController<string[]>(
    logger.error,
    castService.load,
    'keyword'
  );
  const productionService = new StringService(
    'filmproduction',
    'production',
    queryDB.query,
    queryDB.exec
  );
  const production = new ItemsController<string[]>(
    logger.error,
    productionService.load,
    'keyword'
  );
  const countryService = new StringService(
    'filmcountry',
    'country',
    queryDB.query,
    queryDB.exec
  );
  const country = new ItemsController<string[]>(
    logger.error,
    countryService.load,
    'keyword'
  );
  const film = useFilmController(
    logger.error,
    queryDB,
    mapper
  );
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
  const filmCategory = useFilmCategoryController(logger.error, queryDB, mapper);

  const location = useLocationController(logger.error, queryDB, mapper);
  const backofficeLocation = useBackOfficeLocationController(logger.error, queryDB, mapper);
  const locationRate = useLocationRateController(logger.error, queryDB, mapper);
  const locationReaction = useLocationReactionController(logger.error, queryDB, mapper);
  const locationComment = useLocationRateCommentController(
    logger.error,
    queryDB,
    mapper
  );

  const items = useItemController(logger.error, queryDB);
  const itemResponse = useResponseController(logger.error, queryDB, mapper);
  const itemReaction = useResponseReactionController(logger.error, queryDB, mapper);
  const itemCategory = useItemCategoryController(logger.error, queryDB, mapper);
  const brandService = new StringService(
    'brand',
    'brand',
    queryDB.query,
    queryDB.exec
  );
  const brand = new ItemsController<string[]>(
    logger.error,
    brandService.load,
    'keyword'
  );
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
  const backofficeJob = useBackOfficeJobController(logger.error, mainDB, mapper);

  //company-rate
  const criteriaRate = useCompanyRateController(logger.error, queryDB, mapper);
  const criteriaReaction = useCompanyRateReactionController(logger.error, queryDB, mapper);
  const criteriaComment = useCompanyRateCommentController(logger.error, queryDB, mapper);

  return {
    health,
    log,
    middleware,
    authentication,
    signup,
    password,
    myprofile,
    user,
    skill,
    interest,
    lookingFor,
    educationQuery,
    companyQuery,
    appreciation,
    // appreciationReply,
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
    filmCategory,
    director,
    cast,
    production,
    country,
    location,
    locationRate,
    locationReaction,
    locationComment,
    article,
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
    backofficeJob,
    backofficeLocation,
    backofficeCinema,
    saveItem
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
