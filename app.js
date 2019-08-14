// module
const express       = require('express'),
      app           = express(),
      createError   = require('http-errors'),
      path          = require('path'),
      cookieParser  = require('cookie-parser'),
      logger        = require('morgan'),
      bodyParser    = require('body-parser'),
      session       = require('express-session'),
      passport      = require('passport'),
      flash         = require('connect-flash')

// utils
const connectMongoDb     = require('./db/connect-mongodb'),
      checkJwtToken      = require('./auth/checkjwttoken');

// routes module
const indexRouter   = require('./routes/index'),
      authRouter    = require('./routes/auth'),
      usersRouter   = require('./routes/users'),
      checkRouter   = require('./routes/check'),
      apiRouter     = require('./routes/api'),
      postRouter    = require('./routes/post'),
      discoverRouter= require('./routes/discover'),
      contentRouter = require('./routes/contents'),
      commentRouter = require('./routes/comments'),
      profileRouter = require('./routes/profile')

// DB
connectMongoDb();

// http
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// view
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// session for flash
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: false,
  }
}))

app.use(cookieParser());
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

// passport
app.use(passport.initialize());
app.use(checkJwtToken());

// routes
app.use('/', indexRouter);
app.use('/contents', contentRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/check', checkRouter);
app.use('/api', apiRouter);
app.use('/post', postRouter);
app.use('/discover', discoverRouter);
app.use('/comments', commentRouter);
app.use('/profile', profileRouter)

// error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;