const {google} = require('googleapis');
require('dotenv').config();

const oauth2Client = new google.auth.OAuth2(
  process.env.GMAIL_OAUTH_CLIENT_ID,
  process.env.GMAIL_OAUTH_CLIENT_SECRET,
  process.env.GMAIL_OAUTH_REDIRECT_URL
);


const oauth2ClientForRegister = new google.auth.OAuth2(
  process.env.GMAIL_OAUTH_CLIENT_ID,
  process.env.GMAIL_OAUTH_CLIENT_SECRET,
  process.env.GMAIL_OAUTH_REGISTER_REDIRECT_URL
);

const scopes = [
  'https://www.googleapis.com/auth/plus.login',	
  'https://www.googleapis.com/auth/plus.me',
  'https://www.googleapis.com/auth/userinfo.email',
]

const url = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes
})

const registerUrl = oauth2ClientForRegister.generateAuthUrl({
  access_type: 'offline',
  scope: scopes
})

const getGooglePlusApi = (auth) => {
  return google.plus({ version: 'v1', auth });
}

module.exports = {
  url,
  oauth2Client,
  oauth2ClientForRegister,
  registerUrl,
  getGooglePlusApi
}