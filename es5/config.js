"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = exports.config = void 0;
exports.config = {
    port: 8082,
    secure: false,
    template: true,
    allow: {
        origin: 'http://localhost:3000',
        credentials: 'true',
        methods: 'GET,PUT,POST,DELETE,OPTIONS,PATCH',
        headers: 'Access-Control-Allow-Headers, Authorization, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
    },
    log: {
        level: 'debug',
        map: {
            time: '@timestamp',
            msg: 'message',
        },
        db: true,
    },
    middleware: {
        log: true,
        skips: 'health,log,authenticate',
        request: 'request',
        status: 'status',
        size: 'size',
    },
    db: {
        // user: {
        //   user: 'wdqjcywz',
        //   host: 'jelani.db.elephantsql.com',
        //   password: 'Lu5alCoRRRnqjAGJg0zeNfxPjGG684WK',
        //   database: 'wdqjcywz',
        //   port: 5432,
        //   ssl: {
        //     rejectUnauthorized: false,
        //   }
        // },
        // query: {
        //   user: 'wdqjcywz',
        //   host: 'jelani.db.elephantsql.com',
        //   password: 'Lu5alCoRRRnqjAGJg0zeNfxPjGG684WK',
        //   database: 'wdqjcywz',
        //   port: 5432,
        //   ssl: {
        //     rejectUnauthorized: false,
        //   }
        // }
        user: {
            user: 'renhnmkhkoqvjr',
            host: 'ec2-34-199-68-114.compute-1.amazonaws.com',
            password: '05b33690540167d997be040566dfcbc61a85bcdfad400e69cd76ed81aef7eeeb',
            database: 'd1mrc2lb73u081',
            port: 5432,
            ssl: {
                rejectUnauthorized: false,
            }
        },
        query: {
            user: 'renhnmkhkoqvjr',
            host: 'ec2-34-199-68-114.compute-1.amazonaws.com',
            password: '05b33690540167d997be040566dfcbc61a85bcdfad400e69cd76ed81aef7eeeb',
            database: 'd1mrc2lb73u081',
            port: 5432,
            ssl: {
                rejectUnauthorized: false,
            }
        }
    },
    secret: 'secret',
    auth: {
        token: {
            secret: 'secretbackoffice',
            expires: 86400000,
        },
        status: {
            success: 1,
        },
        lockedMinutes: 15,
        maxPasswordFailed: 2,
        payload: {
            id: 'id',
            username: 'username',
            email: 'email',
            userType: 'userType',
        },
        account: {
            displayName: 'displayname',
        },
        userStatus: {
            activated: 'A',
            deactivated: 'D',
        },
        db: {
            user: 'users',
            password: 'passwords',
            id: 'id',
            username: 'username',
            status: 'status',
            successTime: 'successTime',
            failTime: 'failTime',
            failCount: 'failCount',
            lockedUntilTime: 'lockedUntilTime',
        },
        query: "\n      select u.id, u.username, u.displayname, email, u.status, p.* from users u\n      inner join passwords p\n        on u.id = p.id\n      where username = $1 and u.status = 'A'",
        expires: 500,
        template: {
            subject: 'Verification Code',
            body: '%s Use this code for verification. This code will expire in %s minutes',
        },
    },
    signup: {
        expires: 500,
        userStatus: {
            registered: 'R',
            codeSent: 'V',
            activated: 'A',
        },
        maxPasswordAge: 90,
        fields: {
            maxPasswordAge: 'maxPasswordAge',
        },
        map2: {
            firstName: 'surname',
            lastName: 'givenName',
        },
        track: {
            createdAt: 'createdAt',
            createdBy: 'createdBy',
            updatedAt: 'updatedAt',
            updatedBy: 'updatedBy',
            version: 'version',
        },
        url: 'http://localhost:8082/signup/verify',
        template: {
            subject: 'User registration confirmation',
            body: "\nPlease click this link to confirm to activate your account:<br><a href=\"%s\">Confirm Now</a><br><br>\nIf the above button doesn't work for you, please click on the below link or copy paste it on to your browser<br>\n<a href=\"%s\">%s</a><br><br>\nYour link will expire after \"%s\" minutes.\n\nH\u1EABy nh\u1EA5n \u0111\u01B0\u1EDDng link \u1EDF \u0111\u00E2y \u0111\u1EC3 k\u00EDch ho\u1EA1t c\u00E0i kho\u1EA3n c\u1EE7a b\u1EA1n: <br><a href=\"%s\">X\u00E1c nh\u1EADn</a><br><br>\nN\u1EBFu \u0111\u01B0\u1EDDng link \u0111\u00F3 kh\u00F4ng ho\u1EA1t \u0111\u1ED9ng, h\u00E3y sao ch\u00E9p \u0111\u01B0\u1EDDng link \u0111\u00F3 v\u00E0 d\u00E1n v\u00E0o tr\u00ECnh duy\u1EC7t web c\u1EE7a b\u1EA1n<br>\n<a href=\"%s\">%s</a><br><br>\n\u0110\u01B0\u1EDDng link n\u00E0y s\u1EBD h\u1EBFt h\u1EA1n sau \"%s\" ph\u00FAt.",
        },
    },
    password: {
        max: 3,
        expires: 1500,
        db: {
            user: 'users',
            password: 'passwords'
        },
        fields: {
            contact: 'email',
        },
        templates: {
            reset: {
                subject: 'Passcode to reset password',
                body: "Your user name is %s. This is the passcode to reset your password: %s. This passcode will expire in %s minutes.<br>\n        T\u00EAn \u0111\u0103ng nh\u1EADp c\u1EE7a b\u1EA1n l\u00E0 %s. H\u00E3y d\u00F9ng m\u00E3 sau \u0111\u1EC3 t\u1EA1o m\u1EADt kh\u1EA9u l\u1EA1i: %s. M\u00E3 n\u00E0y s\u1EBD h\u1EBFt h\u1EA1n trong %s ph\u00FAt.",
            },
            change: {
                subject: 'Passcode to change password',
                body: "Your user name is %s. This is the passcode to reset your password: %s. This passcode will expire in %s minutes.<br>\n        T\u00EAn \u0111\u0103ng nh\u1EADp c\u1EE7a b\u1EA1n l\u00E0 %s. H\u00E3y d\u00F9ng m\u00E3 sau \u0111\u1EC3 t\u1EA1o m\u1EADt kh\u1EA9u l\u1EA1i: %s. M\u00E3 n\u00E0y s\u1EBD h\u1EBFt h\u1EA1n trong %s ph\u00FAt.",
            },
        },
    },
    mail: {
        provider: 'smtp',
        from: {
            name: 'Supporter',
            email: 'supporter@gmail.com',
        },
        key: ' ',
        smtp: {
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'testsmtp318@gmail.com',
                pass: 'vaseaqiscbgedkga',
            },
        },
    },
    bucket: 'go-firestore-rest-api.appspot.com',
    storage: {
        image: 'avatar',
        cover: 'cover',
        gallery: 'gallery',
    },
    model: {
        id: 'id',
    },
    modelItem: {
        id: 'id',
    },
    modelAppreciation: {
        payload: 'payload',
        createdAt: 'time',
        updatedAt: 'updateAt',
    },
    settings: {
        language: 'en-us',
        dateFormat: 'dd/mm/yyyy',
        timeFormat: 'hh:mm:ss',
        notification: true,
        dateTimeFormat: 'dd-mm-yyyy:hh:mm',
        emailFeedUpdates: true,
        notifyPostMentions: true,
        emailPostMentions: false,
        emailCommentsOfYourPosts: true,
        notifyCommentsOfYourPosts: true,
        showMyProfileInSpacesAroundMe: true,
        emailEventInvitations: true,
        emailWhenNewEventsAround: false,
        showAroundMeResultsInMemberFeed: true,
        followingListPublicOnMyProfile: true,
        notifyWhenNewEventsAround: true,
    },
};
exports.env = {
    sit: {
        mongo: {
            db: 'masterdata_sit',
        },
    },
    prd: {
        log: {
            level: 'error',
        },
        middleware: {
            log: false,
        },
    },
};
//# sourceMappingURL=config.js.map