var express = require('express'),
    fs = require('fs'),
    mongoose = require('mongoose'),
    factfulModels = require('./models');

mongoose.connect('mongodb://localhost/budgetwiser');

var Budget = factfulModels.Budget;
var years = [2010];

years.map(function(year){
    var f = fs.readFileSync(__dirname + '/data/category_' + year + '.tsv');

    var lines = String(f).split('\n');
    var start = 1, end = lines.length;
            var data = lines[start].split('\t');
            data.forEach(function(d_v, d_i, d_arr){
                d_arr[d_i] = String(d_v).replace(/^\s+|\s+$/g, '');
            }); // strip data without blanks.

        }
    }
});

function save_category_01(year, data){
    var cg_01 = Budget.findOne({
        'year': year,
        'name': data[0],
        'category': 0
    });

    cg_01.exec(function(err, obj_01){
    console.log(data);
        if(err) return handleError(err);

        if(obj_01){
            console.log('existing, ' + obj_01.name);
        }else{
            var newCg_01 = new Budget({
                'year': year,
                'name': data[0],
                'category': 0,
                'money': 0
            });

            newCg_01.save(function(err, newObj_01){
                console.log('+ ' + newObj_01.name);
            });
        }
    });
}
