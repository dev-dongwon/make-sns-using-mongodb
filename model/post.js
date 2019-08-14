const mongoose = require('mongoose');
const UserSchema = require('./user').schema;
const CommentSchema = require('./comment').schema;
const Schema = mongoose.Schema;

const postSchema = mongoose.Schema({
  content : String,
  photo : [String],
  createdDate : {
    type : Date,
    default : Date.now()
  },
  meta : {
    views : {
      type : Number,
      default : 0
    },
    likes : {
      type : Number,
      default : 0
    },
    comments : {
      type : Number,
      default : 0
    }
  },
  author : UserSchema,
  likeUsers : {
    type : Map,
    of : { type : Schema.Types.ObjectId, ref : 'User' },
    default : {}
  },
  comments : [CommentSchema],
  display : {
    type : Boolean,
    default : true
  },
});

postSchema.statics.getContentByContentNumber = async function(postNumber) {
  const content = await this.findById(postNumber);
  await content.updateOne({ $inc : {'meta.views' : 1}});
  return content;
}


postSchema.statics.deleteContentByContentNumber = async function(content) {
  await content.updateOne({display : false});
}

postSchema.statics.updateContent = async function(content, files, text) {

  if (files) {
    const updatedImg = files.reduce((acc, img) => {
      acc.push(img.location);
      return acc;
    },[]);
    await content.updateOne({photo : updatedImg});
  }

  if (text) {
    await content.updateOne({content : text})
  }
}

postSchema.statics.updateToBeUnLikeStatus = async function(content, user) {
  await content.set(`likeUsers.${user._id}`, undefined)
  await content.updateOne({ $inc : {'meta.likes' : -1}});
  await content.save();
  
  await user.set(`likePosts.${content._id}`, undefined)
  await user.save();
}

postSchema.statics.updateToBeLikeStatus = async function(content, user) {
  await content.set(`likeUsers.${user._id}`, user._id)
  await content.updateOne({ $inc : {'meta.likes' : 1}});
  await content.save();
  
  await user.set(`likePosts.${content._id}`, content._id)
  await user.save();
}

module.exports = mongoose.model('Post', postSchema);