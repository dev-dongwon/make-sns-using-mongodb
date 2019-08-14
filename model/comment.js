const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = mongoose.Schema({
  content : String,
  createdDate : {
    type : Date,
    default : Date.now()
  },
  authorId : String,
  postId : String,
  username : String,
  userAvatar : String,
  display : {
    type : Boolean,
    default: true,
  }
});

module.exports = mongoose.model('Comment', commentSchema);