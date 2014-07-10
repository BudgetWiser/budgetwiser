var express = require('express'),
    passport = require('passport'),
    accountModels = require('./models');

var User = accountModels.User;

function index(req, res){
    if(req.session.user){
        res.redirect('back');
    }else{
        res.render('account/login');
    }
}
function login(req, res){
    
}
function register(req, res){
    var username = req.param('username'),
        password = req.param('password');

    User.register(
        new User({
            username: username,
            profile: {
                nickname: username + '_nickname'
            }
        }), password, function(err, account) {
        if (err) {
            console.error(err);
            return res.redirect('/login');
        }else{
            console.log(account);
            passport.authenticate('local')(req, res, function(){
                console.log("logined user " + username);
                res.redirect('/login');
            });
        }
    });
}

// routes initialize
function setup(app){
    app.get('/login', index);
    app.post('/login', login);
    app.post('/register', register);
}

module.exports = setup;
