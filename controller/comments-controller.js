const Post = require('../model/post');
const User= require('../model/user');
const Comment = require('../model/comment');

const commentsController = {
  addComment : async (req, res, next) => {
    try {
      const user = await User.findById(req.user._id);
      const {comment, contentId} = req.body
      
      const newComment = await Comment.create({
        content : comment,
        authorId : user._id,
        postId : contentId,
        username : user.username,
        userAvatar : user.profilePhoto,
      })
  
      const post = await Post.findById(contentId);
      post.comments.push(newComment);
      post.meta.comments += 1;
      await post.save();
      
      user.comments.push(newComment);
      await user.save();
      
      return res.json(newComment);
    } catch (error) {
      next(error);
    }
  },

  removeComment : async (req, res, next) => {
    try {
      const commentId = req.params.commentId;
      const comment = await Comment.findById(commentId);
      comment.display = false;
      comment.save();
  
      const post = await Post.findById(comment.postId);
      post.comments.filter(val => `${val._id}` === commentId )[0].display = false;
      post.meta.comments -= 1;
      post.save();
  
      res.json('success');
    } catch (error) {
      next(error);
    }
  },

  updateComment : async (req, res, next) => {
    const {id, updatedReply, contentId} = req.body;
    const post = await Post.findById(contentId);
    post.comments.filter(comment => `${comment._id}` === id)[0]
                  .content = updatedReply;
    await post.save();
    return res.end('success');
  }
}

module.exports = commentsController;