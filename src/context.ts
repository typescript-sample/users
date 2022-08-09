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
} from 'express-ext';
import {
  Controller,
  Query,
  QueryController,
  ReactionController,
  SavedController,
  RateController
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
import { useArticleController } from './article';
import { useBackOfficeCompanyController } from './backoffice/company';
import { useBackOfficeFilmController } from './backoffice/film';
import { useBackOfficeJobController } from './backoffice/job';
import { useBackOfficeLocationController } from './backoffice/location';
import {
  useCompanyCategoryController,
  useFilmCategoryController,
  useItemCategoryController,
} from './category';
import {
  useCinemaController,
  useCinemaRateCommentController,
  useCinemaRateController,
  useCinemaReactionController,
} from "./cinema";
import {
  useBackOfficeCinemaController
} from "./backoffice/cinema";
import { useCommentController } from "./comment";
import {
  useCompanyController,
  useCompanyRateCommentController,
  useCompanyRateController,
  useCompanyReactionController,
} from './company';
import { useRateCriteriaController } from './company-rate';
import {
  useFilmController,
  useFilmRateCommentController,
  useFilmRateController,
  useFilmReactionController,
} from './film';
import { useItemController } from './items';
import {
  ResponseController,
  useResponseController,
  useResponseReactionController,
} from './items-response';
import { useJobController } from './job';
import {
  useLocationController,
  useLocationRateCommentController,
  useLocationRateController,
  useLocationReactionController,
} from './location';
import { useMyArticleController } from './my-articles';
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
import { useUserController } from './user';
import { useSavedController } from './items'
import { UploadController } from 'upload-express';

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
export interface ApplicationContext {
  health: HealthController;
  log: LogController;
  middleware: MiddlewareController;
  authentication: AuthenticationController<User, string>;
  signup: SignupController<Signup>;
  password: PasswordController;
  myprofile: MyProfileController;
  user: QueryController;
  skill: Query;
  interest: Query;
  lookingFor: Query;
  educationQuery: Query;
  companyQuery: Query;
  appreciation: AppreciationController;
  article: QueryController;
  myarticles: Controller;
  cinema: QueryController;
  backofficeCinema: Controller;
  cinemaRate: RateController;
  cinemaReaction: ReactionController;
  cinemaComment: QueryController;
  company: QueryController;
  backofficeCompany: Controller;
  companyRate: RateController;
  companyReaction: ReactionController;
  companyComment: QueryController;
  companyCategory: Controller;
  comment: Controller;
  film: QueryController;
  backOfficeFilm: Controller;
  filmRate: RateController;
  filmReaction: ReactionController;
  filmComment: QueryController;
  filmCategory: Controller;
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
  locationRate: RateController;
  locationReaction: ReactionController;
  locationComment: QueryController;
  jobs: QueryController;
  backofficeJob: Controller;
  rateCriteria: ReactionController;
  saveItem: SavedController;
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
  const companyRate = useCompanyRateController(logger.error, queryDB, mapper);
  const companyReaction = useCompanyReactionController(logger.error, queryDB, mapper);
  const companyComment = useCompanyRateCommentController(
    logger.error,
    mainDB,
    mapper
  );
  const companyCategory = useCompanyCategoryController(
    logger.error,
    queryDB,
    mapper
  );

  const cinema = useCinemaController(logger.error, queryDB, mapper);
  const backofficeCinema = useBackOfficeCinemaController(logger.error, queryDB, mapper);
  const cinemaRate = useCinemaRateController(logger.error, queryDB, mapper);
  const cinemaReaction = useCinemaReactionController(logger.error, queryDB, mapper);
  const cinemaComment = useCinemaRateCommentController(
    logger.error,
    queryDB,
    mapper
  );
  const saveItem=useSavedController(logger.error, queryDB)

  const directorService = new StringService(
    'film_directors',
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
    'film_cast',
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
    'film_productions',
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
    'film_countries',
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
  const rateCriteria = useRateCriteriaController(logger.error, queryDB, mapper);

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
    companyRate,
    companyReaction,
    companyComment,
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
    rateCriteria,
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
