var express = require('express');
var fileUpload = require('express-fileupload');
var async = require('async');
var router = express.Router();

router.use(fileUpload());

var upload_controller = require('../controllers/uploadController');

/* GET users listing. */
router.get('/', function(req, res) {
  res.render('upload');
});

router.post('/', function(req, res) {
  var blobAccountName = req.session.user.blobName;
  var blobAccountKey = req.session.user.blobKey;
  var cosmosdbEndpoint = req.session.user.dbEndpoint;
  var cosmosdbMasterkey = req.session.user.dbKey;
  var cvKey = req.session.user.cvKey;
  var cvURL = req.session.user.cvURL;
  var azureSearchName = req.session.user.searchName;
  var azureSearchKey = req.session.user.searchKey;
  var startTime = req.body.startTime;
  var endTime = req.body.endTime;
  var sampleRate = req.body.sampleRate * 1000;
  if (!req.files)
    return res.status(400).send('No files uploaded.');
  var videoFile = req.files.videoFile;
  var videoFileRootPath = './public/videos/';
  var videoFileName = videoFile.name;

  videoFile.mv(videoFileRootPath + videoFileName, function (err) {
    if (err)
      return res.status(500).send(err);
    var options = {
      pythonPath: '/usr/local/bin/python3',
      args:
      [
        blobAccountName,
        blobAccountKey,
        cosmosdbEndpoint,
        cosmosdbMasterkey,
        cvKey,
        cvURL,
        azureSearchName,
        azureSearchKey,
        startTime,
        endTime,
        sampleRate,
        videoFileRootPath,
        videoFileName
      ]
    };

    videoFileNameNoExtension = videoFileName.split(".")[0];
    upload_controller.handle_upload(req, res, options, azureSearchName, azureSearchKey, videoFileNameNoExtension);
    
  });
});

module.exports = router;
