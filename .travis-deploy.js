// deploy.js
var fs = require( 'vinyl-fs' );
var ftp = require( 'vinyl-ftp' );
var path = require('path');
var ENV = process.env;
var BUILD_PATH = path.resolve(__dirname, 'build');
var TARGET_PATH = '/';
var USERNAME = ENV.wikidaheim_ftp_user;
var PASSWORD = ENV.wikidaheim_ftp_password;
var HOST = ENV.wikidaheim_ftp_server;

var conn = ftp.create( {
		host:     HOST,
		user:     USERNAME,
		password: PASSWORD,
		parallel: 10,
	} );

fs.src( [ `${ BUILD_PATH }/**` ], { buffer: false } )
	.pipe( conn.dest( '/' ) );
