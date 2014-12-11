var express = require('express'),
    introModels = require('./models');

var Members = introModels.Members;

function index(req, res){
    res.render('intro', {
        layout: 'layout',
        partials: {
            home: 'intro_pages/home',
            about: 'intro_pages/about',
            prototypes: 'intro_pages/prototypes',
            members: 'intro_pages/members',
            contact: 'intro_pages/contact'
        },
        members: Members
    });
}

// routes initialize
function setup(app){
    app.get('/', function(req, res){res.redirect('/factful/article/list')});
}

module.exports = setup;
