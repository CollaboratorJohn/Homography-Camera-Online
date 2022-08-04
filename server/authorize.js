const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
var session = require('express-session');

const USER = process.env.USER
const PASSWD = process.env.ADMIN_PASSWORD;
const hash = PASSWD ? bcrypt.hashSync(PASSWD, bcrypt.genSaltSync()) : null;

exports.setup = app => {
  app.use(cookieParser());
  app.use(
    session({
      key: 'user_id',
      secret: 'secretsecret33939',
      resave: false,
      saveUninitialized: false,
      cookie: {
        expires: Infinity,
      },
    })
  );

  app.use((req, res, next) => {
    console.log(req)
    if (req.cookies.user_id && !req.session.user) {
      res.clearCookie('user_id');
    }
    next();
  });
};

exports.checkLoginMiddleware = (req, res, next) => {
  if (req.cookies.user && req.cookies.user_id) {
    next();
  } else {
    res.status(401).send({ message: 'unauthenticated' });
  }
};

exports.authHandler = (req, res, next) => {
  const { password } = req.query;
  if (!hash || bcrypt.compareSync(password, hash)) {
    req.session.user = true;
    res.json({ success: true });
  } else {
    res.status(401).send({ message: 'unauthenticated' });
  }
};
