const User = require('../model/user');
const Post = require('../model/post');

const postController = {
  uploadImage: async (req, res, next) => {
    try {

      if (req.files && req.body.content === undefined) {
        return res.redirect('/');
      }

      const postObj = req.body;
      const user = req.user;
      
      const targetUser = await User.findOne({username : user.username});
      const arr = [];
      
      req.files.forEach((img) => {
        arr.push(img.location);
      });

      const post = await Post.create({
        'content' : postObj.content,
        'photo' : arr || [],
        'author' : targetUser,
      })

      targetUser.posts.push(post._id);
      targetUser.save();

      return res.redirect(`/contents/${post._id}`)

    } catch (err) {
      next(err);
    }
  }
}

module.exports = postController;