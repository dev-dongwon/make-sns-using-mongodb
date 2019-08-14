const Post = require('../model/post');
const User = require('../model/user');

const contentController = {
  getContentPage: async (req, res, next) => {
    try {
      const content = await Post.getContentByContentNumber(req.params.contentNumber);
      
      let user;

      if (req.user) {
        user = await User.findById(req.user._id);
      }
      
      res.render('content', {
        title: 'Daily Frame | The creators Network',
        user: user || null,
        content,
        time : req.query.time,
      });
      
    } catch (error) {
      next(error);
    }
  },

  deleteContent : async (req, res, next) => {
    try {
      await Post.deleteContentByContentNumber(req.content);
      return res.end('success');
    } catch (error) {
      next(error);
    }
  },

  updateContent : async (req, res, next) => {
    try {
      await Post.updateContent(req.content, req.files, req.body.content);
      return res.end('success');
    } catch (error) {
      next(error);
    }
  },

  updateLike : async (req, res, next) => {

    try {
      const user = await User.findById(req.user._id);
      const content = await Post.findById(req.params.contentNumber);
      
      if (content.likeUsers && content.likeUsers.get(`${user._id}`)) {
        await Post.updateToBeUnLikeStatus(content, user);
        return res.end('unlike');
      }
  
      await Post.updateToBeLikeStatus(content, user);
      return res.end('like')
    
    } catch (error) {
      next(error);
    }
  }
}

module.exports = contentController;