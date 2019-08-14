const Post = require('../model/post');

const discoverController = {
  trending : async (req, res) => {
    const page = req.query.page || 0;
    const limit = req.query.limit || 25;

    const postArr = await Post.find({'display' : true}).sort({'meta.views' : -1}).skip(page*limit).limit(limit);
    res.json(postArr);
  }
}

module.exports = discoverController;