var fs= require('fs');
var config = require('../config/config');
var profileImagePath = config.imageUploadPath
var profileThumbnailImagePath = config.imageThumbnailUploadPath
  
function profileImage(req, res, next) {
    fs.readFile(profileImagePath + "profile_" + req.params.userId + ".jpg", function(error,data){
        if (error) {
        res.writeHead(404, {"Content": "image/jpeg"})
        res.end()
        } else {
        res.writeHead(200, {"Content": "image/jpeg"})
        res.end(data)
        }
    })
}

function profileThumbnail(req, res, next) {
    fs.readFile(profileThumbnailImagePath + "profile_" + req.params.userId + "-50x50.jpg", function(error,data){
        if (error) {
        res.writeHead(404, {"Content": "image/jpeg"})
        res.end()
        } else {
        res.writeHead(200, {"Content": "image/jpeg"})
        res.end(data)
        }
    })
}

module.exports = { profileImage, profileThumbnail };