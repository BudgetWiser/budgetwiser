var express = require('express');

function index(req, res){
    // index function
    res.send('factful');
}

function article(req, res){
    this.index = function(req, res){
        res.render('factful/article_add', {
            layout: 'factful/layout'
        });
    };
    this.add = function(req, res){
    };
}

// routes initialize
var article = new article();

function setup(app){
    app.get('/factful/article/list', index);
    app.get('/factful/article/add', article.index);
}

module.exports = setup;
