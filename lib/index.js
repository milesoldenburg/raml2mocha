var Mocha = require('mocha');
var Test = Mocha.Test;
var Suite = Mocha.Suite;

var Q = require('q');
var raml2obj = require('raml2obj');
var request = require('supertest');
var _  = require('underscore');

var ramlObj;
var methodObjects;
var mocha = new Mocha();
var wrapper;

var getSecuredMethodObjects = function(data){
    return _.filter(data, function(element){
        return _.has(element, 'securedBy');
    });
};

var getMethodObjects = function(data){
    var methodObjects = [];

    if (_.has(data, 'resources')) {
        _.each(data.resources, function(element){
            methodObjects = methodObjects.concat(getMethodObjects(element));

            _.each(element.methods, function(methodElement){
                methodObjects.push(_.extend(methodElement, {
                    'relativeUri' : element.relativeUri,
                    'parentUrl' : element.parentUrl
                }));
            });
        });
    }

    return methodObjects;
};

var testSecuredMethodsWithoutAuthentication = function(){
    var deferred = Q.defer();

    var objects = getSecuredMethodObjects(methodObjects);

    var suite = Suite.create(mocha.suite, 'Ensure that all secured methods without authorization return 401');

    _.each(objects, function(element){
        suite.addTest(new Test(element.method.toUpperCase() + ' ' + element.parentUrl + element.relativeUri, function(done){
            switch(element.method.toUpperCase()) {
                case 'GET':
                    return wrapper
                        .get(element.parentUrl + element.relativeUri)
                        .expect(401)
                        .end(function(err){
                            if (err) return done(err);
                            done();
                        });
                    break;
                case 'PUT':
                    return wrapper
                        .put(element.parentUrl + element.relativeUri)
                        .expect(401)
                        .end(function(err){
                            if (err) return done(err);
                            done();
                        });
                    break;
                case 'POST':
                    return wrapper
                        .post(element.parentUrl + element.relativeUri)
                        .expect(401)
                        .end(function(err){
                            if (err) return done(err);
                            done();
                        });
                    break;
                case 'DELETE':
                    return wrapper
                        .delete(element.parentUrl + element.relativeUri)
                        .expect(401)
                        .end(function(err){
                            if (err) return done(err);
                            done();
                        });
                    break;
            }
        }));
    });

    mocha.run(function(){
        deferred.resolve();
    });

    return deferred.promise;
};

var parse = function(options){
    var deferred = Q.defer();

    raml2obj.parse(options.path).then(function(data){
        ramlObj = data;
        methodObjects = getMethodObjects(data);
        wrapper = request(data.baseUri);

        testSecuredMethodsWithoutAuthentication().then(function(){
            deferred.resolve();
        });
    });

    return deferred.promise;
};

module.exports = {
    'parse' : parse
};
