var express = require('express');
var app = express();

var director = require('director');
var router = require('./lib/routes');

app.use(function (req, res, next) {
    router.dispatch(req, res, function (err) {
        if (err) {
            next();
        }
        console.log('Served ' + req.url);
    });
});
app.use(express.static(__dirname));

app.listen(8080);
console.log('express with director running on 8080');