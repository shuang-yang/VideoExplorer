exports.handle_upload = function(req, res, options, azureSearchName, azureSearchKey, videoFileNameNoExtension) {

    var pythonShell = require('python-shell');
    // dbManager = req.session.dbManager;
    var config = require('../config');
    var DocumentDBClient = require('documentdb').DocumentClient;
    var DbManager = require('./DbManager');
    var docDbClient = new DocumentDBClient(config.host, {
        masterKey: config.authKey
      });
    var dbManager = new DbManager(docDbClient, config.databaseId, config.collectionId);
    dbManager.init(function(err) { if(err) throw err; });

    pythonShell.run('../../VideoAnalyzer.py', options, function (err, data) {
        if (err) 
           throw err ;
        // res.send(data);

        // TODO - Add better error handling code here
        if (data.length == 3)
            var id = data[0];
            var name = data[1];
            var url = data[2];
            var username = req.session.user.username;
            dbManager.getItem(username, 'username', function (err, doc) {
                if (err) {
                    throw err;
                } else {
                    var userVideos = doc.videos;
                    // var video = {'id': id, 'name': name, 'url': url};
                    userVideos[name] = {'id': id, 'url': url};
                    // userVideos.push(video);
                    dbManager.updateField(username, 'username', 'videos', userVideos, function(err) {
                        if (err) {
                            throw err;
                        }
                    });   
                }
            });
            res.redirect('./video/' + name + '?url=' + url + '&searchName=' + azureSearchName + '&searchKey=' + azureSearchKey);
    });
};