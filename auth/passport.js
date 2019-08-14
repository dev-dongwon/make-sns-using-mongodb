const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../model/user');
require('dotenv').config()

exports.setup = () => {
  passport.use('local-login', new LocalStrategy({
      usernameField: 'usernameOrEmail',
      passwordField: 'password',
    }, async (usernameOrEmail, password, done) => {
      try {
        const user = await User.findOne().or([{ username : usernameOrEmail }, { email : usernameOrEmail}]);
        if (!user) {
          return done(null, false, {message : {'warning' : 'invaild username or password'}});
        }
        
        if (!await user.isValidPassword(password)) {
          return done(null, false, {message : {'warning' : 'invaild username or password'}});
        }
        return done(null, user, { message : {'success' : 'Logged in Successfully'}});
      } catch (error) {
        return done(error);
      }
    }
  )),

  passport.use('signup', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback: true
  }, async (req, email, password, done) => {
    try {
        const existEmail = await User.findOne({ email });
        const existUsername = await User.findOne({ 'username' : req.body.username });
        
        if (existEmail) {
          return done(null, false, {'warning' : '같은 이메일 주소가 존재합니다'});
        }

        if (existUsername) {
          return done(null, false, {'warning' : '같은 유저 이름이 존재합니다'});
        }

        const user = await User.create({ "username" : req.body.username, email, password });
        return done(null, user, { 'success' :  `${user.username} is Joined Successfully`});
      } catch (error) {
        done(error);
      }
  }))

}