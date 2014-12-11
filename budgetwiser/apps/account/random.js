var express = require('express'),
    passport = require('passport'),
    session = require('./middleware'),
    accountModels = require('./models'),
    fs = require('fs');

var User = accountModels.User;
var pktList = JSON.parse(fs.readFileSync(__dirname + '/pktlist.json'));

function register(req, res){
    console.log(':::start register');
    var charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var length = 3 + Math.floor(Math.random() * 2);

    var username = password = '';

    console.log(':::make username and password randomly');
    for(var i=0; i<length; i++){
        username += charset[Math.floor(Math.random() * charset.length)];
    }
    password = username;
    username = pktList[Math.floor(Math.random() * 728)] + '_' + username;
    console.log(':::created - ' + username, password);

    req.body.username = username;
    req.body.password = password;

    User.register(
        new User({
            username : username,
            profile: {
                email: '',
                nickname: ''
            }
        }), password, function(err, account){
            if(err){
                return res.send(500, {error: err.message});
            }else{
                console.log(':::before login');
                passport.authenticate('local')(req, res, function(){
                    console.log(':::after authenticate');
                    res.redirect('/factful/article/list');
                });
            }
        }
    );
}

module.exports = {
    register: register
};
