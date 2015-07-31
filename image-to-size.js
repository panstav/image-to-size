var fs =    require('fs');
var async = require('async');
var im =    require('imagemagick');

module.exports = function(args, next){

	//-=======================================================---
	//------------------ Procedure Index
	//-=======================================================---

	// async.series
	// takes an array of async functions and a callback
	// executes async functions in sequence
	// and finally (or whenever callback is called with a non-falsy first argument)
	// runs final callback

	async.series(

		[

			setup,              // set some initial values

			resizeFile,         // async.during first executes test, to decide whether any iteration are needed

			iterate_reductions, // keep resize with lower quality till passes args.toSize

			change_direction,   // flip counter to back up in quality and rerun the iterator

			iterate_reductions

		],

		function final(err){
			if (err) return next(err);

			getFileSize(function(err, filesize){
				if (err) return next(err);

				next(null, { quality: args.quality, filesize: filesize })
			});
		}

	);

	//-=======================================================---
	//------------------ Blocks
	//-=======================================================---

	function setup(step){

		// first get the filesize of 100% quality resize
		args.quality = 1;

		// set initial step size
		// it also dictates direction, as this modifier is *added* to the quality as it iterates
		args.modifier = -0.1;

		step();
	}

	function iterate_reductions(step){

		// keep reducing until it passes the requested filesize
		async.during(yet_to_pass, resizeFile, step);

		function yet_to_pass(callback){

			getFileSize(function(err, fileSize){
				if (err) return callback(err);

				// it should pass it twise, first time when it steps down in quality with 0.1 increments
				// second time when it steps up with 0.01 ones

				var didpass;
				if (args.modifier < 0){
					// we're going down
					didpass = fileSize < args.toSize;
				} else {
					// we're backing up
					didpass = fileSize > args.toSize;
				}
				
				// if it has yet to pass - apply the modifier
				// this is basically the counter of our iterator
				if (!didpass) args.quality = Number((args.quality + args.modifier).toFixed(2));

				callback(null, !didpass);
			});
		}
	}

	function change_direction(step){

		// adjust the modifier so that it'd go back up in quality and in smaller steps
		args.modifier = 0.01;

		step();
	}

	function resizeFile(callback){

		im.resize(args, function(err){
			if (err) return callback(err);

			if (args.debug) console.log('Quality is now set to', args.quality);

			callback();
		});

	}

	function getFileSize(callback){

		fs.stat(args.dstPath, function(err, stats){
			if (err) return callback(err);

			var filesize = Math.round(stats.size/1000);

			if (args.debug) console.log('Filesize is now', filesize);

			callback(err, filesize);
		});

	}
};