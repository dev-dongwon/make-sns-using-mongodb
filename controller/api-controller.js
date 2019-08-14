const User = require('../model/user');
const emailsendUtil = require('../utils/nodemailer');
const jwt = require('jsonwebtoken');

const apiController = {
  sendPasswordCheckEmail : async (req, res, next) =>{
    emailsendUtil(req.body.email);
    req.flash('message', {'info' : `[ ${req.body.email} ]로 안내 링크가 전송되었습니다`});
    res.redirect('/forgotpassword')
  },

  resetPassword : async (req, res, next) => {
    const {token, password } = req.body;
    let decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!decodedToken.address) {
      req.flash('message', {'error' : '올바르지 않은 접근 경로입니다'});
      return res.redirect('/');
    }

    try {
      let user = await User.findOneAndUpdate({email : decodedToken.address}, {password});

      if(!user) {
        return res.end('false');
      }

      return res.end('true');
    } catch (error) {
      next(error);
    }
  },

  updateFollowStatus : async (req, res, next) => {
    const user = await User.findById(req.user._id);
    const followTarget = await User.findById(req.params.userId);

    if (user.followings.has(req.params.userId)) {
      await User.cancelFollow(user, followTarget);
      return res.end('unfollow');
    }

    await User.addFollow(user, followTarget);
    return res.end('follow');
  },
}

module.exports = apiController;