var express = require('express');
var bodyParser = require('body-parser');
var basicAuth = require('basic-auth');

var app = express();
var server;
app.use(bodyParser.json());

var auth = function(req, res, next){
    function unauthorized(res){
        res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        return res.sendStatus(401);
    }

    var user = basicAuth(req);

    if (!user || !user.name || !user.pass) {
        return unauthorized(res);
    }

    if (user.name === 'admin' && user.pass === 'password') {
        return next();
    } else {
        return unauthorized(res);
    }
};

var users = [];

app.get('/v1/users', auth, function(req, res){
    res.send(users);
});

app.post('/v1/users', auth, function(req){
    users.push(req.body);
});

module.exports = {
    'start' : function(callback){
        server = app.listen(3000, function(){
            console.log('Test API running on port 3000');
            callback();
        });
    },
    'stop' : function(){
        server.close();
    }
};
