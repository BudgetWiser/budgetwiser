var express = require('express');

function index(req, res){
    // index function
    res.send('factful');
}

// routes initialize
function setup(app){
    app.get('/factful/article/list', index);
}

module.exports = setup;
