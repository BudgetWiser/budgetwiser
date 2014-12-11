var fs = require('fs'),
    mongoose = require('mongoose'),
    factfulModels = require('./models');

mongoose.connect('mongodb://localhost/budgetwiser_live');

var Service = factfulModels.Service,
    Word = factfulModels.Word;

var sf = fs.readFileSync(__dirname + '/data/calc_services_2014.tsv'),
    sl = String(sf).split('\n');

var temp_list = [],
    word_list = [];

for(var i=1; i<sl.length; i++){
    if(sl[i] == '') continue;

    var line = sl[i],
        data = line.split('\t');

    var temp_item = {
        orig_name: data[0],
        calc_name: data[1].replace(/^\s+|\s+$/g, '').split(' '),
        money: data[5],
        sibal: data[6],
        weight: 0,
        _parent: data[4],
        ctg1: data[2].replace(/^\s+|\s+$/g, ''),
        ctg2: data[3].replace(/^\s+|\s+$/g, ''),
        ctg3: data[4].replace(/^\s+|\s+$/g, ''),
    };
    temp_list.push(temp_item);
    word_list = word_list.concat(temp_item.calc_name);
}

console.log('[1/6] data split is completed.');

/**/

var uniq_list = [];

word_list.map(function(word){
    if(uniq_list.indexOf(word) == -1){
        uniq_list.push(word);
    }
});

var fine_list = [];

uniq_list.map(function(word){
    fine_list.push({
        word: word,
        weight: 0
    });
});

console.log('[2/6] cleaning word_list is completed.');

/**/

for(var i=0; i<fine_list.length; i++){
    var fine_word = fine_list[i].word;
    for(var j=0; j<temp_list.length; j++){
        var calc_name = temp_list[j].calc_name.slice(0);
        while(calc_name.indexOf(fine_word) != -1){
            var calc_index = calc_name.indexOf(fine_word);
            fine_list[i].weight += 1;
            calc_name = calc_name.slice(calc_index + 1);
        }
    }
    fine_list[i].weight = Math.log(temp_list.length/fine_list[i].weight);
}

console.log('[3/6] weight is saved');

/* save to DB */

var temp_comp = 0;

temp_list.map(function(temp_item, temp_comp){
    var service = new Service({
        _parent: temp_item._parent,
        orig_name: temp_item.orig_name,
        calc_name: temp_item.calc_name,
        money: temp_item.money,
        sibal: temp_item.sibal,
        ctg1: temp_item.ctg1,
        ctg2: temp_item.ctg2,
        ctg3: temp_item.ctg3
    });
    service.save(function(err){
        if(err) return handleError(err);
        temp_comp += 1;
        if(temp_comp == temp_list.length){
            console.log('[4/6] temp_list(service) DATABASE is saved :', temp_list.length);

            fs.writeFile('services_info.json', JSON.stringify(temp_list), 'utf8', function(err){
                if(err) return handleError(err);

                console.log('[5/6] temp_list(service) JSON is saved :', temp_list.length);
            });

            fs.writeFile('services_word.json', JSON.stringify(fine_list), 'utf8', function(err){
                if(err) return handleError(err);

                console.log('[6/6] fine_list(word) JSON is saved :', fine_list.length);
                process.exit(0);
            });
        };
    });
});


/*
var fine_comp = 0;

fine_list.map(function(fine_item){
    var word = new Word({
        word: fine_item.word,
        weight: fine_item.weight
    });
    word.save(function(err){
        if(err) return handleError(err);
        fine_comp += 1;
        if(fine_comp == fine_list.length){
        }
    });
});
*/
