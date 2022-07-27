export const config = {
  port: 8082,
  secure: false,
  template: true,
  allow: {
    origin: 'http://localhost:3000',
    credentials: 'true',
    methods: 'GET,PUT,POST,DELETE,OPTIONS,PATCH',
    headers:
      'Access-Control-Allow-Headers, Authorization, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
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
    user: {
      user: 'dqcpsquyjmmxkb',
      host: 'ec2-54-228-125-183.eu-west-1.compute.amazonaws.com',
      password: '1093639f514498fbf09e803d98714b853849704783dc052aa1ef2039c60fe6e0',
      database: 'd8maa489i4calm',
      port: 5432,
      ssl: {
        rejectUnauthorized: false,
      }
    },
    query: {
      user: 'dqcpsquyjmmxkb',
      host: 'ec2-54-228-125-183.eu-west-1.compute.amazonaws.com',
      password: '1093639f514498fbf09e803d98714b853849704783dc052aa1ef2039c60fe6e0',
      database: 'd8maa489i4calm',
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
    query: `
      select u.id, u.username, u.displayname, email, u.status, p.* from users u
      inner join passwords p
        on u.id = p.id
      where username = $1 and u.status = 'A'`,
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
      body: `
Please click this link to confirm to activate your account:<br><a href="%s">Confirm Now</a><br><br>
If the above button doesn't work for you, please click on the below link or copy paste it on to your browser<br>
<a href="%s">%s</a><br><br>
Your link will expire after "%s" minutes.

Hẫy nhấn đường link ở đây để kích hoạt cài khoản của bạn: <br><a href="%s">Xác nhận</a><br><br>
Nếu đường link đó không hoạt động, hãy sao chép đường link đó và dán vào trình duyệt web của bạn<br>
<a href="%s">%s</a><br><br>
Đường link này sẽ hết hạn sau "%s" phút.`,
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
        body: `Your user name is %s. This is the passcode to reset your password: %s. This passcode will expire in %s minutes.<br>
        Tên đăng nhập của bạn là %s. Hãy dùng mã sau để tạo mật khẩu lại: %s. Mã này sẽ hết hạn trong %s phút.`,
      },
      change: {
        subject: 'Passcode to change password',
        body: `Your user name is %s. This is the passcode to reset your password: %s. This passcode will expire in %s minutes.<br>
        Tên đăng nhập của bạn là %s. Hãy dùng mã sau để tạo mật khẩu lại: %s. Mã này sẽ hết hạn trong %s phút.`,
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
        user: '',
        pass: '',
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

export const env = {
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
