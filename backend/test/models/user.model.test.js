var mongoose = require('mongoose');
var Mockgoose = require('mockgoose').Mockgoose;
var expect = require('chai').expect;

var mockgoose = new Mockgoose(mongoose);
var User = require('../../models/user.model');

describe('User scheme test', function() {

    before(function(done) {
        mockgoose.prepareStorage().then(function() {
            mongoose.set('useCreateIndex', true);
            mongoose.connect('mongodb://example.com/TestingDB', { useNewUrlParser: true }, function(err) {
                done(err);
            });
        });
    });

    after("Drop db", function(done) {
        // Here is when the error is trigged
        mockgoose.helper.reset().then(function() {
            done();
        });
    });

    beforeEach(function(done) {
        User.create({
            email: 'test1@test.com',
            role: 'system',
            status: 'active'
        })

        User.create({
            email: 'test2@test.com',
            role: 'user',
            status: 'pending'
        })

        done();
    });

    afterEach(function(done) {
        mockgoose.helper.reset().then(function () {
            done();
        });
    });

    describe('list()', function() {

        it('User.list() should give all documents back', function(done) {
            User.list()
            .then(docs => {
                expect(docs.length).to.equal(2);
                done();
            }).catch(e => {
                done(e);
            });
        });

        it('User.list({limit=0}) should give all documents back', function(done) {
            User.list({limit:0})
            .then(docs => {
                expect(docs.length).to.equal(2);
                done();
            }).catch(e => {
                done(e);
            });
        });

        it('User.list({limit=1}) should give 1 document back', function(done) {
            User.list({limit:1})
            .then(docs => {
                expect(docs.length).to.equal(1);
                done();
            }).catch(e => {
                done(e);
            });
        });

    });

});