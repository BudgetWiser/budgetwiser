var express = require('express'),
    passport = require('passport'),
    accountModels = require('./models');

var User = accountModels.User;

function login_page(req, res){
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
    passport.authenticate('local', function(err, user, info){
        if(err){return res.send(500);}
        if(!user){return res.send(500);}
        req.login(user, function(err){
            if(err){
                return res.send(500);
            }
            return res.send(200);
        });
    })(req, res);
}

function logout(req, res){
    req.logout();
    res.redirect('/');
}

function register_page(req, res){
    if(req.user){
        res.redirect('back');
    }else{
        res.render('account/register', {
            layout: 'layout',
            next: req.param('next')
        });
    }
}

function register(req, res){
    var username = req.param('username'),
        password = req.param('password'),
        nickname = req.param('nickname'),
        email = req.param('email'),
        next = req.param('next');

    User.register(
        new User({
            username: username,
            profile: {
                email: email,
                nickname: nickname
            }
        }), password, function(err, account) {
        if (err) {
            return res.send(500, {error: err.message});
        }else{
            login(req, res);
        }
    });
}

// routes initialize
function setup(app){
    app.get('/login', login_page);
    app.post('/login', login);
    app.get('/logout', logout);
    app.get('/register', register_page);
    app.post('/register', register);
}

module.exports = setup;
