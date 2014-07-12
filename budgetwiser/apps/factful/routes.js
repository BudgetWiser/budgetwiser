var express = require('express');

function index(req, res){
    // index function
    res.send('factful');
}

function article(req, res){
    function init(req, res){
        res.render('factful/article_add', {
            layout: 'factful/layout'
        });
    }

    return {
        init: init
    };
}

// routes initialize
var article = article();

function setup(app){
    app.get('/factful/article/list', index);
    app.get('/factful/article/add', article.init);
}

module.exports = setup;
