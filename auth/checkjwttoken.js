const jwt = require('jsonwebtoken')
const User = require('../model/user');
require('dotenv').config()

const checkJwtToken = () => async (req, res, next) => {
  
  if (!req.cookies.token) {
    req.user = false;
    return next();
  }
  
  const token = req.cookies.token;

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    let user = decodedToken.user;

    if (!decodedToken.user.username) {
      user = await User.findOne({ 'auth.googleId' : decodedToken.user.auth.googleId});
    }

    req.user = user;
    return next();
  } catch (error) {
    return next(error);
  }
}

module.exports = checkJwtToken;