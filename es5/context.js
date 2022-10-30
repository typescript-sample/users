"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSend = exports.hasTwoFactors = exports.generate = exports.useContext = void 0;
var storage_1 = require("@google-cloud/storage");
var authen_express_1 = require("authen-express");
var authen_service_1 = require("authen-service");
var bcrypt_1 = require("bcrypt");
var bcrypt_plus_1 = require("bcrypt-plus");
var express_ext_1 = require("express-ext");
var google_storage_1 = require("google-storage");
var jsonwebtoken_plus_1 = require("jsonwebtoken-plus");
var mail_core_1 = require("mail-core");
var nodemailer_1 = __importDefault(require("nodemailer"));
var password_express_1 = require("password-express");
var password_service_1 = require("password-service");
var pg_extension_1 = require("pg-extension");
var query_core_1 = require("query-core");
var sendgrid_plus_1 = require("sendgrid-plus");
var shortid_1 = __importDefault(require("shortid"));
var signup_express_1 = require("signup-express");
var signup_service_1 = require("signup-service");
var xvalidators_1 = require("xvalidators");
var appreciation_1 = require("./appreciation");
var article_1 = require("./article");
var cinema_1 = require("./backoffice/cinema");
var company_1 = require("./backoffice/company");
var film_1 = require("./backoffice/film");
var job_1 = require("./backoffice/job");
var location_1 = require("./backoffice/location");
var music_1 = require("./backoffice/music");
var room_1 = require("./backoffice/room");
var category_1 = require("./category");
var cinema_2 = require("./cinema");
var comment_1 = require("./comment");
var company_2 = require("./company");
var film_2 = require("./film");
var items_1 = require("./items");
var items_2 = require("./items");
var items_response_1 = require("./items-response");
var job_2 = require("./job");
var location_2 = require("./location");
var music_2 = require("./music");
var my_articles_1 = require("./my-articles");
var my_items_1 = require("./my-items");
var my_profile_1 = require("./my-profile");
var room_2 = require("./room");
var user_1 = require("./user");
var user_2 = require("./user");
express_ext_1.resources.createValidator = xvalidators_1.createValidator;
function useContext(mainDB, queryDB, logger, midLogger, conf, mapper) {
    var log = new express_ext_1.LogController(logger);
    var middleware = new express_ext_1.MiddlewareController(midLogger);
    var sqlChecker = (0, query_core_1.createChecker)(mainDB);
    var health = new express_ext_1.HealthController([sqlChecker]);
    var sendMail = useSend(conf.mail);
    var comparator = new bcrypt_plus_1.Comparator();
    // const encrypter = new RC4Encrypter(conf.secret);
    var auth = conf.auth;
    var status = (0, authen_service_1.initializeStatus)(conf.auth.status);
    var codeMailSender = new authen_service_1.CodeMailSender(sendMail, conf.mail.from, conf.auth.template.body, conf.auth.template.subject);
    var verifiedCodeRepository = new pg_extension_1.CodeRepository(mainDB, 'authencodes');
    var userRepository = (0, authen_service_1.useUserRepository)(queryDB, conf.auth);
    var authenticator = new authen_service_1.Authenticator(status, bcrypt_1.compare, jsonwebtoken_plus_1.generateToken, auth.token, auth.payload, auth.account, userRepository, undefined, auth.lockedMinutes, 2, codeMailSender.send, conf.auth.expires, verifiedCodeRepository, comparator.hash);
    var authentication = new authen_express_1.AuthenticationController(logger.error, authenticator.authenticate, conf.cookie);
    var signupMailSender = new signup_service_1.SignupSender(conf.signup.url, sendMail, conf.mail.from, conf.signup.template.body, conf.signup.template.subject);
    var passcodeRepository = new pg_extension_1.CodeRepository(mainDB, 'signupcodes');
    var signupRepository = (0, signup_service_1.useRepository)(mainDB, 'users2', 'passwords', conf.signup.userStatus, conf.signup.fields, conf.signup.maxPasswordAge, conf.signup.track, conf.signup.map);
    var validator = new signup_service_1.Validator();
    var signupStatus = (0, signup_service_1.initStatus)(conf.signup.status);
    var signupService = new signup_service_1.SignupService(signupStatus, signupRepository, generate, comparator, comparator, passcodeRepository, signupMailSender.send, conf.signup.expires, validator.validate);
    var signup = new signup_express_1.SignupController(logger.error, signupService);
    var passwordMailSender = new password_service_1.MailSender(sendMail, conf.mail.from, conf.password.templates.reset.body, conf.password.templates.reset.subject);
    var codeRepository = new pg_extension_1.CodeRepository(mainDB, 'passwordcodes');
    var passwordRepository = (0, password_service_1.usePasswordRepository)(mainDB, conf.password.db, conf.password.max, conf.password.fields);
    var passwordService = new password_service_1.PasswordService(comparator, passwordRepository, passwordMailSender.send, conf.password.expires, codeRepository, conf.password.max, undefined);
    var password = new password_express_1.PasswordController(logger.error, passwordService);
    var user = (0, user_2.useUserController)(logger.error, mainDB);
    var reaction = (0, user_1.useReactionController)(logger.error, mainDB);
    var userFollow = (0, user_2.useUserFollowController)(logger.error, mainDB);
    var userInfo = (0, user_1.useUserInfoController)(logger.error, mainDB, mapper);
    var locationInfomation = (0, location_2.useLocationInfomationController)(logger.error, mainDB, mapper);
    var skillService = new pg_extension_1.StringService('skill', 'skill', queryDB.query, queryDB.exec);
    var skill = new express_ext_1.ItemController(logger.error, skillService.load, 'keyword');
    var interestService = new pg_extension_1.StringService('interest', 'interest', queryDB.query, queryDB.exec);
    var interest = new express_ext_1.ItemController(logger.error, interestService.load, 'keyword');
    var lookingForService = new pg_extension_1.StringService('search', 'item', queryDB.query, queryDB.exec);
    var lookingFor = new express_ext_1.ItemController(logger.error, interestService.load, 'keyword');
    var companyService = new pg_extension_1.StringService('user_companies', 'company', queryDB.query, queryDB.exec);
    var companyQuery = new express_ext_1.ItemController(logger.error, companyService.load, 'keyword');
    var educationService = new pg_extension_1.StringService('educations', 'school', queryDB.query, queryDB.exec);
    var educationQuery = new express_ext_1.ItemController(logger.error, educationService.load, 'keyword');
    var appreciation = (0, appreciation_1.useAppreciationController)(logger.error, mainDB);
    var appreciationComment = (0, appreciation_1.useAppreciationCommentController)(logger.error, mainDB);
    var appreciationReaction = (0, appreciation_1.useAppreciationReactionController)(logger.error, mainDB, generate);
    var storageConfig = { bucket: conf.bucket, public: true };
    var storage = new storage_1.Storage();
    var bucket = storage.bucket(conf.bucket);
    var storageRepository = new google_storage_1.GoogleStorageRepository(bucket, storageConfig, google_storage_1.map);
    var sizesCover = [576, 768];
    var sizesImage = [40, 400];
    var repository = new query_core_1.Repository(mainDB, 'users', my_profile_1.userModel);
    var myprofile = (0, my_profile_1.useMyProfileController)(logger.error, repository, conf.settings, skillService.save, interestService.save, lookingForService.save, educationService.save, companyService.save);
    var myprofileUpload = (0, my_profile_1.useMyProfileUploadController)(logger.error, repository, storageRepository, google_storage_1.deleteFile, generate, (0, google_storage_1.useBuildUrl)(conf.bucket), sizesCover, sizesImage, undefined, conf.model);
    var article = (0, article_1.useArticleController)(logger.error, mainDB);
    var articleRate = (0, article_1.useArticleRateController)(logger.error, queryDB, mapper);
    var articleReaction = (0, article_1.useArticleReactionController)(logger.error, queryDB, mapper);
    var articleComment = (0, article_1.useArticleRateCommentController)(logger.error, queryDB, mapper);
    var myarticles = (0, my_articles_1.useMyArticleController)(logger.error, queryDB, mapper);
    var company = (0, company_2.useCompanyController)(logger.error, queryDB);
    var backofficeCompany = (0, company_1.useBackOfficeCompanyController)(logger.error, queryDB);
    var backofficeCompanyUpload = (0, company_1.useCompanyUploadController)(logger.error, queryDB, storageRepository, google_storage_1.deleteFile, generate, (0, google_storage_1.useBuildUrl)(conf.bucket), [], [], undefined, conf.modelItem, mapper);
    var companyCategory = (0, category_1.useCompanyCategoryController)(logger.error, queryDB, mapper);
    var cinema = (0, cinema_2.useCinemaController)(logger.error, queryDB, mapper);
    var cinemaRate = (0, cinema_2.useCinemaRateController)(logger.error, queryDB, mapper);
    var cinemaReaction = (0, cinema_2.useCinemaReactionController)(logger.error, queryDB, mapper);
    var cinemaComment = (0, cinema_2.useCinemaRateCommentController)(logger.error, queryDB, mapper);
    var backofficeCinema = (0, cinema_1.useBackOfficeCinemaController)(logger.error, queryDB, mapper);
    var backofficeCinemaUpload = (0, cinema_1.useCinemaUploadController)(logger.error, queryDB, storageRepository, google_storage_1.deleteFile, generate, (0, google_storage_1.useBuildUrl)(conf.bucket), [], [], undefined, conf.modelItem, mapper);
    var saveItem = (0, items_2.useSavedController)(logger.error, queryDB);
    var saveLocation = (0, location_2.useSavedLocationController)(logger.error, queryDB);
    var saveFilm = (0, film_2.useSavedFilmsController)(logger.error, queryDB);
    var saveMusic = (0, music_2.useSavedMusicsController)(logger.error, queryDB);
    var saveListsong = (0, music_2.useSavedListSongController)(logger.error, queryDB);
    var directorService = new pg_extension_1.StringService('filmdirector', 'director', queryDB.query, queryDB.exec);
    var director = new express_ext_1.ItemController(logger.error, directorService.load, 'keyword');
    var castService = new pg_extension_1.StringService('casts', 'actor', queryDB.query, queryDB.exec);
    var cast = new express_ext_1.ItemController(logger.error, castService.load, 'keyword');
    var productionService = new pg_extension_1.StringService('filmproduction', 'production', queryDB.query, queryDB.exec);
    var production = new express_ext_1.ItemController(logger.error, productionService.load, 'keyword');
    var countryService = new pg_extension_1.StringService('filmcountry', 'country', queryDB.query, queryDB.exec);
    var country = new express_ext_1.ItemController(logger.error, countryService.load, 'keyword');
    var film = (0, film_2.useFilmController)(logger.error, queryDB, mapper);
    var backOfficeFilm = (0, film_1.useBackOfficeFilmController)(logger.error, queryDB, directorService.save, castService.save, productionService.save, countryService.save, mapper);
    var filmRate = (0, film_2.useFilmRateController)(logger.error, queryDB, mapper);
    var filmReaction = (0, film_2.useFilmReactionController)(logger.error, queryDB, mapper);
    var filmComment = (0, film_2.useFilmRateCommentController)(logger.error, queryDB, mapper);
    var userRate = (0, user_1.useUserRateController)(logger.error, queryDB, mapper);
    var userReaction = (0, user_1.useUserReactionController)(logger.error, queryDB, mapper);
    var userComment = (0, user_1.useUserRateCommentController)(logger.error, queryDB, mapper);
    var filmCategory = (0, category_1.useFilmCategoryController)(logger.error, queryDB, mapper);
    var backOfficeFilmUpload = (0, film_1.useFilmUploadController)(logger.error, queryDB, storageRepository, google_storage_1.deleteFile, generate, (0, google_storage_1.useBuildUrl)(conf.bucket), [], [], undefined, conf.modelItem, mapper);
    var location = (0, location_2.useLocationController)(logger.error, queryDB, mapper);
    var backofficeLocation = (0, location_1.useBackOfficeLocationController)(logger.error, queryDB, mapper);
    var backofficeLocationUpload = (0, location_1.useLocationUploadController)(logger.error, queryDB, storageRepository, google_storage_1.deleteFile, generate, (0, google_storage_1.useBuildUrl)(conf.bucket), [], [], undefined, conf.modelItem, mapper);
    var locationRate = (0, location_2.useLocationRateController)(logger.error, queryDB, mapper);
    var locationReaction = (0, location_2.useLocationReactionController)(logger.error, queryDB, mapper);
    var locationComment = (0, location_2.useLocationRateCommentController)(logger.error, queryDB, mapper);
    var locationFollow = (0, location_2.useLocationFollowController)(logger.error, queryDB);
    var items = (0, items_1.useItemController)(logger.error, queryDB);
    var itemResponse = (0, items_response_1.useResponseController)(logger.error, queryDB, mapper);
    var itemReaction = (0, items_response_1.useResponseReactionController)(logger.error, queryDB, mapper);
    var itemCategory = (0, category_1.useItemCategoryController)(logger.error, queryDB, mapper);
    var brandService = new pg_extension_1.StringService('brand', 'brand', queryDB.query, queryDB.exec);
    var brand = new express_ext_1.ItemController(logger.error, brandService.load, 'keyword');
    var myitems = (0, my_items_1.useMyItemController)(logger.error, queryDB, storageRepository, brandService.save, google_storage_1.deleteFile, generate, (0, google_storage_1.useBuildUrl)(conf.bucket), [], [], undefined, conf.modelItem, mapper);
    var myitemsUpload = (0, my_items_1.useMyItemUploadController)(logger.error, queryDB, storageRepository, brandService.save, google_storage_1.deleteFile, generate, (0, google_storage_1.useBuildUrl)(conf.bucket), [], [], undefined, conf.modelItem, mapper);
    var comment = (0, comment_1.useCommentController)(logger.error, queryDB, mapper);
    var jobs = (0, job_2.useJobController)(logger.error, mainDB, mapper);
    var room = (0, room_2.useRoomController)(logger.error, mainDB, mapper);
    var backofficeJob = (0, job_1.useBackOfficeJobController)(logger.error, mainDB, mapper);
    var backofficeRoom = (0, room_1.useBackOfficeRoomController)(logger.error, mainDB, mapper);
    var music = (0, music_2.useMusicController)(logger.error, mainDB, mapper);
    var backofficeMusic = (0, music_1.useBackOfficeMusicController)(logger.error, mainDB, mapper);
    var playlist = (0, music_2.usePlaylistController)(logger.error, mainDB, mapper);
    // company-rate
    var criteriaRate = (0, company_2.useCompanyRateController)(logger.error, queryDB, mapper);
    var criteriaReaction = (0, company_2.useCompanyRateReactionController)(logger.error, queryDB, mapper);
    var criteriaComment = (0, company_2.useCompanyRateCommentController)(logger.error, queryDB, mapper);
    return {
        health: health,
        log: log,
        middleware: middleware,
        authentication: authentication,
        signup: signup,
        password: password,
        myprofile: myprofile,
        myprofileUpload: myprofileUpload,
        user: user,
        reaction: reaction,
        userFollow: userFollow,
        skill: skill,
        interest: interest,
        lookingFor: lookingFor,
        educationQuery: educationQuery,
        companyQuery: companyQuery,
        appreciation: appreciation,
        appreciationComment: appreciationComment,
        appreciationReaction: appreciationReaction,
        comment: comment,
        cinema: cinema,
        cinemaRate: cinemaRate,
        cinemaReaction: cinemaReaction,
        cinemaComment: cinemaComment,
        company: company,
        companyCategory: companyCategory,
        film: film,
        filmRate: filmRate,
        filmReaction: filmReaction,
        filmComment: filmComment,
        userRate: userRate,
        userReaction: userReaction,
        userComment: userComment,
        filmCategory: filmCategory,
        backOfficeFilmUpload: backOfficeFilmUpload,
        director: director,
        cast: cast,
        production: production,
        country: country,
        location: location,
        locationRate: locationRate,
        locationReaction: locationReaction,
        locationComment: locationComment,
        article: article,
        articleRate: articleRate,
        articleComment: articleComment,
        articleReaction: articleReaction,
        myarticles: myarticles,
        items: items,
        itemCategory: itemCategory,
        itemResponse: itemResponse,
        itemReaction: itemReaction,
        brand: brand,
        myitems: myitems,
        myitemsUpload: myitemsUpload,
        jobs: jobs,
        criteriaRate: criteriaRate,
        criteriaReaction: criteriaReaction,
        criteriaComment: criteriaComment,
        backOfficeFilm: backOfficeFilm,
        backofficeCompany: backofficeCompany,
        backofficeCompanyUpload: backofficeCompanyUpload,
        backofficeJob: backofficeJob,
        backofficeLocation: backofficeLocation,
        backofficeLocationUpload: backofficeLocationUpload,
        backofficeCinema: backofficeCinema,
        backofficeCinemaUpload: backofficeCinemaUpload,
        saveItem: saveItem,
        locationFollow: locationFollow,
        userInfo: userInfo,
        saveLocation: saveLocation,
        locationInfomation: locationInfomation,
        saveFilm: saveFilm,
        backofficeRoom: backofficeRoom,
        music: music,
        backofficeMusic: backofficeMusic,
        room: room,
        saveMusic: saveMusic,
        playlist: playlist,
        saveListsong: saveListsong
    };
}
exports.useContext = useContext;
function generate() {
    return shortid_1.default.generate();
}
exports.generate = generate;
function hasTwoFactors(userId) {
    return Promise.resolve(false);
}
exports.hasTwoFactors = hasTwoFactors;
function useSend(conf) {
    if (conf.provider === 'sendgrid') {
        return new sendgrid_plus_1.SendGridMailService(conf.key).send;
    }
    else {
        var transporter = nodemailer_1.default.createTransport(conf.smtp);
        return new mail_core_1.MailService(transporter).send;
    }
}
exports.useSend = useSend;
//# sourceMappingURL=context.js.map