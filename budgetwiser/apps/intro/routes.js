var express = require('express');

function index(req, res){
    res.render('index', {
        layout: 'layout'
    });
}

// routes initialize
function setup(app){
    app.get('/', index);
}

module.exports = setup;
