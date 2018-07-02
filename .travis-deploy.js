// deploy.js
var Client = require('ftp');
var chalk = require('chalk');
var fs = require('fs');
var path = require('path');
var ENV = process.env;
var BUILD_PATH = path.resolve(__dirname, ENV.FTP_BUILD_PATH || 'build');
var TARGET_PATH = '/';
var USERNAME = ENV.wikidaheim_ftp_user;
var PASSWORD = ENV.wikidaheim_ftp_password;
var HOST = ENV.wikidaheim_ftp_user;
var PORT = ENV.FTP_SERVER_PORT || 21;

var client = new Client();
client.on('greeting', function(msg) {
  console.log(chalk.green('greeting'), msg);
});
client.on('ready', function() {
  client.list(TARGET_PATH, function(err, serverList) {
    console.log(chalk.green('get list from server.'));
    /*
     * somehow you need to workout what files you are going to upload
     * you may need to compare with what already exists in the server
     */
    var uploadList = listFiles( BUILD_PATH );
    var total = uploadList.length;
    var uploadCount = 0;
    var errorList = [];
    uploadList.forEach(function(file) {
      console.log(chalk.blue('start'), file.local + chalk.grey(' --> ') + file.target);
      client.put(file.local, file.target, function(err) {
        uploadCount++;
        if (err) {
          console.error(chalk.red('error'), file.local + chalk.grey(' --> ') + file.target);
          console.error(err.message);
          throw err;
        } else {
          console.info(chalk.green('success'), file.local + chalk.grey(' --> ') + file.target, chalk.grey('( ' + uploadCount + '/' + total + ' )'));
        }

        if (uploadCount === total) {
          client.end();
          if (errorList.length === 0) {
            console.info(chalk.green('All files uploaded!'));
          } else {
            console.log(chalk.red('Failed files:'));
            errorList.forEach(function(file) {
              console.log(file.local + chalk.grey(' --> ') + file.target);
            });
            throw 'Total Failed: ' + errorList.length;
          }
        }
      });
    });
  });
});
// connect to localhost:21 as anonymous
client.connect({
  host: HOST,
  port: PORT,
  user: USERNAME,
  password: PASSWORD,
});

const listFiles = dir => {
  let filesList = [];

  const files = fs.readdirSync(dir);
  files.map(file => {
    const fullPath = path.resolve(dir, file);
    const stats = fs.lstatSync(fullPath);

    if (stats.isDirectory()) {
      filesList = filesList.concat(listFiles(fullPath));
    } else {
      if (dir.endsWith(BUILD_PATH)) {
        filesList.push({
        'local': fullPath,
        'target': file
        });
      } else {
        const lastSeparator = dir.lastIndexOf(path.sep);
        const parentDir = dir.substring(lastSeparator);
        const targetPath = ${parentDir}${path.sep}${file}.replace(/\\/g, '/');

        filesList.push({
        'local': fullPath,
        'target': targetPath
        });
      }
    }
  });

  return filesList;
};
