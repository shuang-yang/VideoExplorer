// Catalogue route module
var express = require('express');
var router = express.Router();

// Controller for search
var search_controller = require('../controllers/searchController');

router.get('/', function (req, res) {
	if (req.query.term != undefined) {
		search_controller.search_result_catalogue(req, res);
	} else {
		res.render('catalogue', {videos: req.session.videos});
	}
});

module.exports = router;