const Post = require('../model/post');

const isSameUser = (req, content) => {
  return req.user.username === content.author.username;
}

const isAuthor = async (req, res, next) => {
  
  const content = await Post.findById(req.params.contentNumber);
  if (isSameUser(req, content)) {
    req.content = content;
    return next();
  }

  req.flash('message', {'warning' : '권한 없음'});
  return res.redirect(`/contents/${$content._id}`);
};

const isNotAuthor = async (req, res, next) => {
  
  const content = await Post.findById(req.params.contentNumber);

  if (!isSameUser(req, content)) {
    req.content = content;
    return next();
  }

  req.flash('message', {'warning' : '권한 없음'});
  return res.redirect(`/contents/${content._id}`);
};

const isNotAuthorForAjax = async (req, res, next) => {
  
  const content = await Post.findById(req.params.contentNumber);

  if (!isSameUser(req, content)) {
    req.content = content;
    return next();
  }

  return res.end('fail');
};

 module.exports = { 
   isAuthor,
   isNotAuthor,
   isNotAuthorForAjax
};