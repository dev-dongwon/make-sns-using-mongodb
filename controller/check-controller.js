const User = require('../model/user');

const checkController = {
  checkDupleUsername : async (req, res, next) =>{
    try {
      const username = req.params.username;
      const user = await User.findOne({ username });
      if (user) {
        return res.send(true);
      }
      return res.send(null);

    } catch (error) {
      next(error);
    }
  },

  checkDupleEmail : async (req, res, next) =>{
    try {
      const email = req.params.email;
      const user = await User.findOne({ email });
      if (user) {
        return res.send(true);
      }
      return res.send(null);

    } catch (error) {
      next(error);      
    }
  }
}

module.exports = checkController;