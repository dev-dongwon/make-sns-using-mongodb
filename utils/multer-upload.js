const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
const awsConfig = require('../aws/aws-sdk-config');
const uuid = require('../utils/uuid');

AWS.config.update(awsConfig);
const s3 = new AWS.S3();

const upload = multer({
  storage: multerS3({
      s3: s3,
      bucket: "dailyframe",
      contentType: multerS3.AUTO_CONTENT_TYPE,
      acl: 'public-read',
      key: (req, file, cb) => {
        cb(null, uuid() + '-' + file.originalname);
      },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = upload;