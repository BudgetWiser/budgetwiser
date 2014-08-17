var express = require('express'),
    fs = require('fs'),
    mongoose = require('mongoose'),
    factfulModels = require('./models');

mongoose.connect('mongodb://localhost/budgetwiser');

var Budget = factfulModels.Budget;
var budgetData = [];
var years = [2010, 2011, 2012, 2013];

years.map(function(year){
    var cf = fs.readFileSync(__dirname + '/data/category_' + year + '.tsv');
    var sf = fs.readFileSync(__dirname + '/data/services_' + year + '.tsv');

    var cLines = String(cf).split('\n');
    for(var i=1; i<cLines.length; i++){
        if(cLines[i] == '') continue;

        var data = cLines[i].split('\t');
        data.forEach(function(d_v, d_i, d_arr){
            d_arr[d_i] = String(d_v).replace(/^\s+|\s+$/g, '');
        }); // strip data without blanks.

        /*
         * save data - categories.
         */
        var ctg_1 = dataSearch(year, data[0], 1, budgetData);
        if(!ctg_1){
            budgetData.push({
                'year': year,
                'name': data[0],
                'category': 1,
                'children': [],
                'money': 0
            });
            ctg_1 = budgetData[budgetData.length - 1];
        }
        var ctg_2 = dataSearch(year, data[1], 2, budgetData);
        if(!ctg_2){
            ctg_1.children.push({
                'year': year,
                'name': data[1],
                'category': 2,
                'children': [],
                'money': 0
            });
            ctg_2 = ctg_1.children[ctg_1.children.length - 1];
        }
        var ctg_3 = dataSearch(year, data[2], 3, budgetData);
        if(!ctg_3){
            ctg_2.children.push({
                'year': year,
                'name': data[2],
                'category': 3,
                'children': [],
                'money': parseInt(data[3])
            });
            ctg_3 = ctg_2.children[ctg_2.children.length - 1];
        }
        ctg_1.money += ctg_3.money, ctg_2.money += ctg_3.money;
    }

    var sLines = String(sf).split('\n');
    for(var i=i; i<sLines.length; i++){
        if(sLines[i] == '') continue;

        var data = sLines[i].split('\t');
        data.forEach(function(d_v, d_i, d_arr){
            d_arr[d_i] = String(d_v).replace(/^\s+|\s+$/g, '');
        }); // strip data without blanks.

        /*
         * save data - services.
         */
        var ctg_3 = dataSearch(year, data[3], 3, budgetData);
        if(ctg_3){
            ctg_3.children.push({
                'year': year,
                'name': data[0],
                'category': 4,
                'money': data[4]
            });
        }
    }
});

saveData(budgetData);
process.exit(0);

/*
 * functions
 */
function dataSearch(year, name, category, data){
    for(var i=0; i<data.length; i++){
        if(data[i].category == category){
            if(data[i].year == year && data[i].name == name){
                return data[i];
            }
        }else{
            if(data[i].children){
                return dataSearch(year, name, category, data[i].children);
            }
        }
    }
    return;
}

function saveData(data, _parent){
    for(var i=0; i<data.length; i++){
        var budget = new Budget({
            year: data[i].year,
            name: data[i].name,
            category: data[i].category,
            money: data[i].money
        });
        if(_parent){
            budget._parent = _parent;
        }
        budget.save(function(err){
            if(err) return err;

            console.log(budget._id, 'saved // category : ', budget.category);
        });
        if(budget.category < 4){
            saveData(data[i].children, budget);
        }
    }
}