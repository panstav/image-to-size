var fs = require('fs');
var im = require('imagemagick');

module.exports = function(file, callback){

	// first we get the filesize of 100% quality resize
	file.quality = 1;

	im.resize(file, function(err){
		if (err) return callback(err);



		// nothing to do here, 100% quality resize has small enough filesize for user
		return callback(null, { quality: file.quality, filesize: result });
	});
};

function isBingo(options, callback){

	fs.stat(options.dstPath, function(err, stats){
		if (err) return callback(err);

		var bingoItIs = Math.round(stats.size/1000) < options.toSize;

		callback(null, bingoItIs);
	})

}