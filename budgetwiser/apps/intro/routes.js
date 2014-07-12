var express = require('express');

function index(req, res){
    res.render('intro', {
        layout: 'base',
        partials: {
            home: 'intro_pages/home',
            about: 'intro_pages/about',
            prototypes: 'intro_pages/prototypes',
            members: 'intro_pages/members'
        }
    });
}

// routes initialize
function setup(app){
    app.get('/', index);
}

module.exports = setup;
