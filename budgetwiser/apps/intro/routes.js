var express = require('express'),
    introModels = require('./models');

var Members = introModels.Members;

function index(req, res){
    res.render('intro', {
        layout: 'base',
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
    app.get('/', index);
}

module.exports = setup;
