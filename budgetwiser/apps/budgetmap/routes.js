var express = require('express');
var mongo = require('mongoskin');

function index(req, res){
    // index function
}

// routes initialize
function setup(app){
    app.get('/', index);

    app.get('/budget-vis', function(req, res) {
        res.render('budgetmap/budget-vis', { title : 'Budget-vis Test' });
    });

    app.get('/data', function(req, res) {
        var db = mongo.db('mongodb://localhost:17027/budgetmap_proto', {native_parser: true});

        var result = {
            "name": "budgetdata",
            "children": []
        };

        db.collection('seoul_functional').find().toArray(function(err, items) {
            for (var i in items) {
                var doc = items[i];

                var exist = false;
                var child = null;
                for (var j in result.children) {
                    var item = result.children[j];

                    if (item.name == doc.level1) {
                        exist = true;
                        child = item;
                        break;
                    }
                }
                if (exist == false) {
                    child = {};
                    child.name = doc.level1;
                    child.children = [];
                    result.children.push(child);
                }

                var new_obj = {};
                new_obj.name = doc.level2;
                new_obj.size = doc.yr_2014;

                var yr_2014 = parseInt(doc.yr_2014);
                var yr_2013 = parseInt(doc.yr_2013);

                if (yr_2013 == 0) {
                    new_obj.rate = 0;
                }
                else {
                    new_obj.rate = (yr_2014 - yr_2013) / yr_2013;
                }

                child.children.push(new_obj);
            }
            res.json(result);
        });
    });
}

module.exports = setup;
