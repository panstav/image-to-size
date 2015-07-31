#! /usr/bin/env node

var extend = require('util')._extend;
var minimist = require('minimist');
var ims =  require('./image-to-size');

//-=======================================================---
//------------------ Arguments
//-=======================================================---

var argv = minimist(process.argv.slice(2), {
	alias: {
		'srcPath': 's',
		'dstPath': 'd',
		'toSize': 't'
	}
});

var defaults = {
	'srcPath': './src/_MG_5843.jpg',
	'dstPath': './dest/_MG_5843.jpg',
	'toSize': 100,
	height: 800,
	debug: false
};

var options = extend(defaults, argv);

//-=======================================================---
//------------------ Sending image to optimization
//-=======================================================---

ims(options, function(err, results){

	if (err){
		console.log(err);

		process.exit(1);
	}

	console.log('\n\t\u001b[32mGreat!\u001b[39m Images were optimized successfully.');
	console.log('\tFilesize:', results.filesize + 'KB', 'Quality:', results.quality, '\n');

	process.exit(0);

});