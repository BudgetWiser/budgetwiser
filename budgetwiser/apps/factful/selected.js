var express = require('express'),
    fs = require('fs'),
    mongoose = require('mongoose'),
    factfulModels = require('./models');

mongoose.connect('mongodb://localhost/budgetwiser_D');

var Budget = factfulModels.Budget;

fs.readFile(__dirname + '/data/services_selected.tsv', 'utf8', function(err, data){
    if(err) return err;

    var lines = String(data).split('\n');
    for(var i=1; i<lines.length; i++){
        if(lines[i] == '') continue;

        var line = lines[i].split('\t');
        var budget = new Budget({
            year: 2014,
            name: line[0],
            category: 4,
            money: line[4]
        });
        budget.save(function(err){
            if(err) return err;
            console.log(budget);
        });
    }
});
