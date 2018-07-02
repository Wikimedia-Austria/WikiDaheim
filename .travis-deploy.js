// deploy.js
var FtpDeploy = require('ftp-deploy');
var fs = require('fs');
var path = require('path');
var ENV = process.env;
var BUILD_PATH = path.resolve(__dirname, ENV.FTP_BUILD_PATH || 'build');
var TARGET_PATH = '/';
var USERNAME = ENV.wikidaheim_ftp_user;
var PASSWORD = ENV.wikidaheim_ftp_password;
var HOST = ENV.wikidaheim_ftp_server;

var ftpDeploy = new FtpDeploy();

var config = {
    user: USERNAME,
    password: PASSWORD,
    host: HOST,
    port: 21,
    localRoot: BUILD_PATH,
    remoteRoot: TARGET_PATH,
    include: ['*', '**/*', '*.htaccess'],
    deleteRoot: false,
}
// use with callback
ftpDeploy.deploy(config, function(err) {
    if (err) console.log(err);
    else console.log('finished');
});
