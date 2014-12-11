var express = require('express'),
    random = require('./random');

function isAuth(req, res, next){
    if(req.user){
        next();
    }else{
        console.log(':::before random.register');
        random.register(req, res);
        /*
        var redirect = "/account/login?next=" + req.url;
        res.redirect(redirect);
        */
    }
}

function isNotAuth(req, res, next){
    if(req.user){
        res.redirect('back');
    }else{
        next();
    }
}

function isAdmin(req, res, next){
    console.log(req.user);
    if(req.user){
        if(req.user.username == 'admin'){
            next();
        }else{
            res.send('You are not admin');
        }
    }else{
        var redirect = "/account/login?next=" + req.url;
        res.redirect(redirect);
    }
}

module.exports = {
    isAuth: isAuth,
    isNotAuth: isNotAuth,
    isAdmin : isAdmin
};
