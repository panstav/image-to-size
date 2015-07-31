#! /usr/bin/env node

var minimist =        require('minimist');
var toSize =  require('./index');

// get those arguments aliased
var argv = minimist(process.argv.slice(2), {
	alias: {
		srcPath: 's',
		dstPath: 'd',
		toSize: 't'
	}
});

var options = {
	srcPath: './src/_MG_5843.jpg',
	dstPath: './dest/_MG_5843.jpg',
	toSize: 100,
	height: 800
};

// alright - optimize images
toSize(options, function(err, result){

	if (err){
		console.log(err);

		process.exit(1);
	}

	console.log('\u001b[32mGreat!\u001b[39m Images were optimized successfully.');
	console.log(result);

	process.exit(0);
	
});