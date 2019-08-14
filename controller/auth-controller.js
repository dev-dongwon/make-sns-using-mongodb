const passport = require('passport');
const jwt = require('jsonwebtoken');
const googleAuthApi = require('../auth/googleapis');
const User = require('../model/user');

require('dotenv').config()
require('../auth/passport').setup()

const authController = {
  localLogin: (req, res, next) => {
    passport.authenticate('local-login', {
      session : false
    }, async (err, user, info) => {
      try {
        if (err || !user) {
          req.flash('message',info.message)
          return res.redirect('/signin')
        }

        req.login(user, { session: false }, async (error) => {
          if (error) return next(error)
          const body = {
            _id: user._id,
            username : user.username || user.email,
            email: user.email
          };

          const token = await jwt.sign({ user: body }, process.env.JWT_SECRET);
          res.cookie('token', token, {
            httpOnly : true,
            maxAge: 1000*60*60
          });
          req.flash('message',info.message)
          return res.redirect('/');
        });
      } catch (error) {
        return next(error);
      }
    })(req, res, next)
  },

  googleLogin : (req, res, next) => {
    return res.redirect(googleAuthApi.url)
  },

  googleRegister : (req, res, next) => {
    return res.redirect(googleAuthApi.registerUrl);
  },

  googleRegisterCallback : async (req, res, next) => {
    
    try {
      const code = req.query.code;
      const {tokens} = await googleAuthApi.oauth2ClientForRegister.getToken(code);
      googleAuthApi.oauth2ClientForRegister.setCredentials(tokens);
  
      const plus = googleAuthApi.getGooglePlusApi(googleAuthApi.oauth2ClientForRegister);
      const me = await plus.people.get({ userId: 'me' });
      const email = me.data.emails[0].value;
      const profilePhoto = me.data.image.url;
      const existEmail = await User.findOne({ 'auth.googleId' : email });
  
      if (existEmail) {
        req.flash('message', {'info' : '이미 google 회원가입이 되어 있습니다!'});
        res.redirect('/signin');
        return;
      }
      
      const user = await User.create({'auth.googleId' : email, 'profilePhoto' :profilePhoto});
      req.flash('message', {'success' : 'google 회원가입이 완료되었습니다'});
      return res.redirect('/signin')

    } catch (error) {
      next(error);
    }
  },

  googleLoginCallback : async (req, res, next) => {
    const code = req.query.code;
    const {tokens} = await googleAuthApi.oauth2Client.getToken(code);
    googleAuthApi.oauth2Client.setCredentials(tokens);

    const plus = googleAuthApi.getGooglePlusApi(googleAuthApi.oauth2Client);
    const me = await plus.people.get({ userId: 'me' });

    const email = me.data.emails && me.data.emails.length && me.data.emails[0].value;
    const user = await User.findOne({ 'auth.googleId' : email });

    if(!user) {
      req.flash('message', {'info' : '아직 회원 가입을 안하셨군요?'});
      return res.redirect('/signup');
    }

    req.user = user;
    const token = jwt.sign({ user }, process.env.JWT_SECRET);
    res.cookie('token', token, {
      httpOnly : true,
      maxAge: 1000 * 60 * 60,
    });

    if (!user.username) {
      req.flash('message', {'info' : '회원정보를 입력하시면 가입이 완료됩니다 (username 필수)'});
      return res.redirect('/users/initSettings');
    }

    res.redirect('/')
  },

  logout : (req, res, next) => {
    res.clearCookie('token', { path: '/' })
    return res.redirect('/');
  },

  resetPassword : (req, res, next) => {
    const token = req.query.token;
    let decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedToken.address) {
      req.flash('message', {'error' : '올바르지 않은 접근 경로입니다'});
      return res.redirect('/');
    }

    res.render('resetpassword', {
      title: 'Reset password | Daily Frame',
      email: decodedToken.address,
      token: token
    });
  }
}

module.exports = authController;