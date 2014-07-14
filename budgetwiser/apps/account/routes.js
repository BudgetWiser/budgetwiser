var express = require('express'),
    passport = require('passport'),
    accountModels = require('./models');

var User = accountModels.User;

function index(req, res){
    if(req.user){
        res.redirect('back');
    }else{
        res.render('account/login', {
            layout: 'layout',
            next: req.param('next')
        });
    }
}

function login(req, res){
    passport.authenticate('local')(req, res, function(){
        console.log("logined user " + req.param('username'));

        if(req.param('next') != ''){
            res.redirect(req.param('next'));
        }else{
            res.send('logined - ' + req.param('username'));
        }
    });
}

function logout(req, res){
    req.logout();
    res.redirect('/');
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
                console.log("registered & logined user " + username);
                res.send('registered & logined - ' + req.param('username'));
            });
        }
    });
}

// routes initialize
function setup(app){
    app.get('/login', index);
    app.post('/login', login);
    app.get('/logout', logout);
    app.post('/register', register);
}

module.exports = setup;
