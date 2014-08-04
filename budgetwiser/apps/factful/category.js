var fs = require('fs'),
    parser = require('./parser');

fs.readFile('services_2013.tsv', 'utf8', function(err, data){
    if(err) return console.log(err);

    var output = {};
    output.category = [], output.keywords = [];

    var lines = data.split('\n');
    var exc = [' ', '', '.', ',', 'U+00B7', '및'], exc_cand = [];

    var regexp = new RegExp('[0-9]+');
    var post = new RegExp('은|는|이|가$');

    for(var i=1; i<lines.length; i++){
        var line = lines[i].split('\t');
        var category_name = line[1], category_index = output.category.indexOf(category_name);

        if(category_index == -1){
            output.category.push(category_name);
            category_index = output['category'].length - 1;
            output.keywords[category_index] = [];
        }

        for(var j=0; j<line.length; j++){
            if(j!=4){
                line[j].split(' ').map(function(word){
                    word = String(word).replace(/^\s+|\s+$/g, '');
                    /*
                    if(word.length != 0){
                        for(var k=2; k<word.length; k++){
                            var s_word = word.slice(0,k);
                            var s_word_re = word.slice(-k);
                            console.log(s_word, s_word_re);

                            if(!regexp.test(s_word) && exc.indexOf(s_word) == -1 && output.keywords[category_index].indexOf(s_word) == -1){
                                output.keywords[category_index].push(s_word);
                            }
                            if(!regexp.test(s_word_re) && exc.indexOf(s_word_re) == -1 && output.keywords[category_index].indexOf(s_word_re) == -1){
                                output.keywords[category_index].push(s_word_re);
                            }
                        }
                    }*/

                    /*
                    var word_list = word.match(/.{1,2}/g);
                    if(word_list){
                        word_list.map(function(word_item){
                            word_item = String(word_item).replace(/^\s+|\s+$/g, '');
                            if(!regexp.test(word_item) && exc.indexOf(word_item) == -1 && output.keywords[category_index].indexOf(word_item) == -1){
                                output.keywords[category_index].push(word_item);
                            }
                        });
                    }*/

                    var word_list = word.match(/[가-힣]+/g);

                    if(word_list){
                        word_list.map(function(word_item){
                            if(post.test(word_item)){
                                word_item = word_item.slice(0, -1);
                            }
                            if(!regexp.test(word_item) && exc.indexOf(word_item) == -1 && output.keywords[category_index].indexOf(word_item) == -1){
                                output.keywords[category_index].push(word_item);
                            }
                        });
                    }
                });
            }
        }
    }

    var cleaned_keywords = [];
    for(var i=0; i<output.keywords.length; i++){
        cleaned_keywords[i] = [];
        for(var j=0; j<output.keywords[i].length; j++){
            var word = output.keywords[i][j];
            var count = 0;
            for(var k=0; k<output.keywords.length; k++){
                if(i != k){
                    if(output.keywords[k].indexOf(word) != -1){
                        count++;
                    }
                }
            }
            if(count < 3 && word.length > 1 && isNaN(parseInt(word))){
                cleaned_keywords[i].push(word);
            }
        }
    }
    output.keywords = cleaned_keywords;

    fs.writeFile('category.json', JSON.stringify(output), 'utf8', function(err){
        if(err) return console.log(err);

        console.log('category.json is saved');
    });
});
