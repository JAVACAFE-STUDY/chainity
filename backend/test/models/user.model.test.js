'use strict';
var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;

require('sinon-mongoose');

var User = require('../../models/user.model');

describe("Post a new user", function(){
    it("should create new post", function(done){
        var UserMock = sinon.mock(new User({ email: "test@test.com",
                                            // role: "user",
                                            status: 1234}));
        var user = UserMock.object;
        var expectedResult = { status: true };
        UserMock.expects('save').yields(null, expectedResult);
        user.save(function (err, result) {
            UserMock.verify();
            UserMock.restore();
            console.log(result)
            expect(result.status).to.be.true;
            done();
        });
    });
    // Test will pass if the user is not saved
    it("should return error, if post not saved", function(done){
        var UserMock = sinon.mock(new User({ email: "test@test.com",
                                            role: "user",
                                            status: "active"}));
        var user = UserMock.object;
        var expectedResult = { status: false };
        UserMock.expects('save').yields(expectedResult, null);
        user.save(function (err, result) {
            UserMock.verify();
            UserMock.restore();
            expect(err.status).to.not.be.true;
            done();
        });
    });
});