var express = require('express'),
    budgetmapModels = require('./models');

function index(req, res){
    // index function
}

// routes initialize
function setup(app){
    app.get('/', index);
}

module.exports = setup;
