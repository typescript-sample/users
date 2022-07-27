import { Storage } from "@google-cloud/storage";
import { AuthenticationController } from "authen-express";
import {
  Authenticator,
  CodeMailSender,
  initializeStatus,
  SqlAuthTemplateConfig,
  User,
  useUserRepository,
} from "authen-service";
import { compare } from "bcrypt";
import { Comparator } from "bcrypt-plus";
import {
  HealthController,
  LogController,
  Logger,
  Middleware,
  MiddlewareController,
  ModelConfig,
  QueryController,
  resources,
  useBuild,
} from "express-ext";
import {
  deleteFile,
  GoogleStorageRepository,
  map,
  StorageConfig,
  useBuildUrl,
} from "google-storage";
import { generateToken } from "jsonwebtoken-plus";
import { MailConfig, MailService, Send } from "mail-core";
import nodemailer from "nodemailer";
import { ModelConf, StorageConf } from "one-storage";
import { PasswordController } from "password-express";
import {
  MailSender,
  PasswordService,
  PasswordTemplateConfig,
  usePasswordRepository,
} from "password-service";
import { CodeRepository, DB, StringService } from "pg-extension";
import { createChecker } from "query-core";
import { TemplateMap } from "query-mappers";
import { SendGridMailService } from "sendgrid-plus";
import shortid from "shortid";
import { SignupController } from "signup-express";
import {
  initStatus,
  Signup,
  SignupSender,
  SignupService,
  SignupTemplateConfig,
  useRepository,
  Validator,
} from "signup-service";
import { createValidator } from "xvalidators";
import {
  AppreciationController,
  AppreciationReplyController,
  useAppreciationController,
  useAppreciationReplyController,
} from "./appreciation";
import { ArticleController, useArticleController } from "./article";
import { CategoryController, useCategoryController } from "./category";
import { CommentController, useCommentController } from "./comment";
import { ItemController, useItemController } from "./items";
import {
  useResponseCommentController,
  useResponseController,
  ResponseCommentController,
  ResponseController
} from "./response";
import {
  ArticleController as MyArticleController,
  useMyArticleController,
} from "./my-articles";
import { MyItemController, useMyItemController } from "./my-items";
import {
  MyProfileController,
  useMyProfileController,
  UserSettings,
} from "./my-profile";
import { UserController, useUserController } from "./user";
import {
  LocationController,
  useLocationController,
  LocationRateController,
  useLocationRateController,
} from "./location";

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
  brand: QueryController<string[]>;
  skill: QueryController<string[]>;
  interest: QueryController<string[]>;
  lookingFor: QueryController<string[]>;
  appreciation: AppreciationController;
  location: LocationController;
  locationRate: LocationRateController;
  article: ArticleController;
  myarticles: MyArticleController;
  appreciationReply: AppreciationReplyController;
  myitems: MyItemController;
  category: CategoryController;
  items: ItemController;
  response: ResponseController;
  itemComment: ResponseCommentController;
  comment: CommentController;
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
    "authencodes"
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
  const passcodeRepository = new CodeRepository<string>(mainDB, "signupcodes");
  const signupRepository = useRepository<string, Signup>(
    mainDB,
    "users",
    "passwords",
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
  const codeRepository = new CodeRepository<string>(mainDB, "passwordcodes");
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

  const brandService = new StringService(
    "brands",
    "brand",
    queryDB.query,
    queryDB.exec
  );
  const brand = new QueryController<string[]>(
    logger.error,
    brandService.load,
    "keyword"
  );
  const skillService = new StringService(
    "skills",
    "skill",
    queryDB.query,
    queryDB.exec
  );
  const skill = new QueryController<string[]>(
    logger.error,
    skillService.load,
    "keyword"
  );
  const interestService = new StringService(
    "interests",
    "interest",
    queryDB.query,
    queryDB.exec
  );
  const interest = new QueryController<string[]>(
    logger.error,
    interestService.load,
    "keyword"
  );
  const lookingForService = new StringService(
    "searchs",
    "item",
    queryDB.query,
    queryDB.exec
  );
  const lookingFor = new QueryController<string[]>(
    logger.error,
    interestService.load,
    "keyword"
  );

  const appreciation = useAppreciationController(
    logger.error,
    mainDB,
    undefined,
    build
  );
  const appreciationReply = useAppreciationReplyController(
    logger.error,
    mainDB,
    undefined,
    build
  );

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
    sizesCover,
    sizesImage,
    undefined,
    conf.model
  );
  const location = useLocationController(logger.error, queryDB, mapper);
  const locationRate = useLocationRateController(logger.error, queryDB, mapper);
  const article = useArticleController(logger.error, mainDB);
  const myarticles = useMyArticleController(logger.error, queryDB, mapper);
  const items = useItemController(logger.error, queryDB);
  const response = useResponseController(logger.error, queryDB, mapper);
  const itemComment = useResponseCommentController(logger.error, queryDB, mapper);

  const myitems = useMyItemController(
    logger.error,
    queryDB,
    brandService.save,
    mapper
  );
  const comment = useCommentController(logger.error, queryDB, mapper);
  const category = useCategoryController(logger.error, queryDB);
  return {
    health,
    log,
    middleware,
    authentication,
    signup,
    password,
    myprofile,
    user,
    brand,
    skill,
    interest,
    lookingFor,
    appreciation,
    location,
    locationRate,
    article,
    myarticles,
    appreciationReply,
    myitems,
    items,
    response,
    itemComment,
    comment,
    category,
  };
}

export function generate(): string {
  return shortid.generate();
}
export function hasTwoFactors(userId: string): Promise<boolean> {
  return Promise.resolve(false);
}
export function useSend(conf: MailConfig): Send {
  if (conf.provider === "sendgrid") {
    return new SendGridMailService(conf.key).send;
  } else {
    const transporter = nodemailer.createTransport(conf.smtp);
    return new MailService(transporter).send;
  }
}
