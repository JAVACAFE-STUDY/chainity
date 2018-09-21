var fs= require('fs');
var config = require('../config/config');

function load(req, res, next, relPath) {
    req.absPath = config.imageUploadPath + relPath;
    return next();
}

function get(req, res) {
    fs.readFile(req.absPath, function(error,data){
        if (error) {
            res.writeHead(404, {"Content": "image/jpeg"})
            res.end()
        } else {
            res.writeHead(200, {"Content": "image/jpeg"})
            res.end(data)
        }
    })
}

module.exports = { load, get };