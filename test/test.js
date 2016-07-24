var raml2mocha = require('../lib/index');
var server = require('./server');

server.start(function(){
    raml2mocha.parse({
        'path' : 'api.raml'
    }).then(function(){
        server.stop();
    });
});
