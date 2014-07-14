var express = require('express');

function isAuth(req, res, next){
    if(req.user){
        next();
    }else{
        var redirect = "/account/login?next=" + req.url;
        res.redirect(redirect);
    }
}

function isNotAuth(req, res, next){
    if(req.user){
        res.redirect('back');
    }else{
        next();
    }
}

module.exports = {
    isAuth: isAuth,
    isNotAuth: isNotAuth
};
