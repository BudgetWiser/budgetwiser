var express = require('express'),
    session = require('../account/middleware'),
    fs = require('fs'),
    parser = require('./parser');

function index(req, res){
    // index function
    res.send('factful');
}

function article(req, res){
    function addPage(req, res){
        res.render('factful/article_add', {
            layout: 'factful/layout',
            user_profile: req.user.profile
        });
    }
    function addFunc(req, res){
        var data = {
            date: req.param('date'),
            press: req.param('press'),
            title: req.param('title'),
            subtitle: req.param('subtitle'),
            content: req.param('content')
        };

        var p_list = parser.paragraph(data.content);
        parser.findMoney(p_list);
    }

    return {
        addPage: addPage,
        addFunc: addFunc
    };
}

// routes initialize
var article = article();

function setup(app){
    app.get('/factful', function(req, res){res.redirect('/factful/article/list')});
    app.get('/factful/article/list', index);
    app.get('/factful/article/add', session.isAdmin, article.addPage);
    app.post('/factful/article/add', article.addFunc);
}

module.exports = setup;
