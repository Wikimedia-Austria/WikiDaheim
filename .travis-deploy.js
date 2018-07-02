// deploy.js
var ftpSync = require('ftpsync');
var fs = require('fs');
var path = require('path');
var ENV = process.env;
var BUILD_PATH = path.resolve(__dirname, ENV.FTP_BUILD_PATH || 'build');
var TARGET_PATH = '/';
var USERNAME = ENV.wikidaheim_ftp_user;
var PASSWORD = ENV.wikidaheim_ftp_password;
var HOST = ENV.wikidaheim_ftp_server;

var options = {
  host: HOST,
  user: USERNAME,
  pass: PASSWORD,
  local: BUILD_PATH,
  remote: TARGET_PATH
};

ftpSync.settings = options;
ftpSync.run(function(err, result) {
  if(err) {
    throw err;
  } else {
    console.log('Successfully synced files.');
  }
});
