const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const userSchema = mongoose.Schema({
  username : String,
  email : String,
  password : String,
  location : String,
  bio : String,
  link : String,
  auth : {
    googleId : String
  },
  profilePhoto : {
    type : String,
    default : '/images/profile_dummy.png'
  },
  posts : [{ type : Schema.Types.ObjectId, ref : 'Post' }],
  comments : [{type : Schema.Types.ObjectId, ref : 'Comment' }],
  createdDate : {
    type : Date,
    default : Date.now()
  },
  likePosts : {
    type : Map,
    of : { type : Schema.Types.ObjectId, ref : 'Post' },
    default : {}
  },
  likeUsers : {
    type : Map,
    of : { type : Schema.Types.ObjectId, ref : 'User' },
    default : {}
  },
  followings : {
    type : Map,
    of : { type : Schema.Types.ObjectId, ref : 'User' },
    default : {}
  },
  followers : {
    type : Map,
    of : { type : Schema.Types.ObjectId, ref : 'User' },
    default : {}
  }
});

userSchema.pre('save', async function(next) {

  if (this.auth.googleId) {
    next();
  }

  if (this.password.length > 12) {
    next();
  }

  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  next();
})

userSchema.pre('update', async function(next) {

  if (this.auth.googleId) {
    next();
  }

  if (this._update.password.length > 12) {
    next();
  }
  
  const hash = await bcrypt.hash(this._update.password, 10);
  this._update.password = hash;
  next();
})

userSchema.statics.addFollow = async function(user, followTarget) {
  await user.set(`followings.${followTarget._id}`, followTarget._id);
  await user.save();
  
  await followTarget.set(`followers.${user._id}`, user._id);
  await followTarget.save();
}

userSchema.statics.cancelFollow = async function(user, followTarget) {
  await user.set(`followings.${followTarget._id}`, undefined);
  await user.save();
  
  await followTarget.set(`followers.${user._id}`, undefined);
  await followTarget.save();
}


userSchema.methods.isValidPassword = async function(password) {
  const compare = await bcrypt.compare(password, this.password);
  return compare;
}

module.exports = mongoose.model('User', userSchema);