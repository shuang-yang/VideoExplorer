
// Return list of search results
exports.search_result_video = function(req, res) {

 	var pythonShell = require('python-shell');

 	var options = {
		pythonPath: '/usr/local/bin/python3',
 		args:
 		[
			req.query.term,
			req.params.id,
			req.session.user.searchName,
			req.session.user.searchKey
			// req.query.searchName,
			// req.query.searchKey
 		]
	};
	
	console.log('args: ' + options.args);

 	pythonShell.run('../VideoAnalyzer/Search.py', options, function (err, data) {
 		if (err) 
			throw err ;
		var values = JSON.parse(data[0]).value;
		var resultsByRel = values;
		// console.log(data);
		// res.send(data);
		// var resultsByTime = values.sort(function(a, b) {
		// 	return a.time > b.time? 1 : -1;
		// });
 		res.render('video', {resultsByRel: resultsByRel, resultsByTime: [], searchTerm: req.query.term, url: req.query.url});
 	});
};

exports.search_result_catalogue = function(req, res) {

	var pythonShell = require('python-shell');

	var options = {
	   pythonPath: '/usr/local/bin/python3',
		args:
		[
		   req.query.term,
		   req.session.user.searchName,
		   req.session.user.searchKey
		]
   };
   
   console.log('args: ' + options.args);

	pythonShell.run('../VideoAnalyzer/SearchCatalogue.py', options, function (err, data) {
		if (err) 
		   throw err ;
		var values = JSON.parse(data[0]).value;
	//    var resultsByRel = values;
	    // console.log(data);
	//    res.send(data);
		var videos = {};
		if (values != undefined) {
			for (var i = 0; i < values.length; i++) {
				if (values[i].filename in videos) {
					videos[values[i].filename].push(values[i]);
				} else {
					videos[values[i].filename] = [values[i]];
				}
			}
		}
		console.log(videos);
		res.render('catalogueSearch', {videos: videos});
	});
};

