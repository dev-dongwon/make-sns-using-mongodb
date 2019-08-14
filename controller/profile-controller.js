const Post = require('../model/post');
const User = require('../model/user')

const profileController = {
  home: async (req, res) => {

    const author = await User.findOne({username : req.params.username})
                           .populate({path : 'posts'});

    let user;

    if (req.user) {
      user = await User.findById(req.user._id);
    }

    const posts = author.posts.filter(val => val.display === true);
    
    res.render('profile', {
      title: 'Profile | The creators Network',
      user: user || null,
      author,
      posts,
      requestUser : req.params.username
    });
  },
}

module.exports = profileController;