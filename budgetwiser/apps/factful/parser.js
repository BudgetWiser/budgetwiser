var fs = require('fs'),
    express = require('express'),
    factfulModels = require('./models');

var Service = factfulModels.Service,
    Word = factfulModels.Word;

var parser = {};

parser.trim = function(str){
    return String(str).replace(/^\s+|\s+$/g, '');
};

parser.paragraph = function(str){
    var p_list = str.split('\n\n');
    var img_patt = new RegExp('<image http://(.)+>');

    p_list.forEach(function(val, i, arr){
        var type = 0;

        if(img_patt.test(val)){
            arr[i] = val.split('<image ')[1].split('>')[0];
            type = 1;
        }

        arr[i] = {
            type: type,
            content: parser.trim(arr[i])
        };
    });

    return p_list;
};

parser.findMoney = function(p, moneyList){
    var moneyRegex = new RegExp('(([0-9,]+)조( )?)?(([0-9,]+)억( )?)?(([0-9,]+)만( )?)?(여)?원', 'g');
    var regArray, output = [];

    while((regArray = moneyRegex.exec(p.content)) != null){
        var money_word = regArray[0],
            money_1t = regArray[2],
            money_100m = regArray[5],
            money_10k = regArray[8];

        if(typeof(money_1t) !== 'undefined'){
            money_1t = parseInt(money_1t.replace(",", ""));
            money_1t = money_1t * 1000000000000;
        }else{
            money_1t = 0;
        }
        if(typeof(money_100m) !== 'undefined'){
            money_100m = parseInt(money_100m.replace(",", ""));
            money_100m = money_100m * 100000000;
        }else{
            money_100m = 0;
        }
        if(typeof(money_10k) !== 'undefined'){
            money_10k = parseInt(money_10k.replace(",", ""));
            money_10k = money_10k * 10000;
        }else{
            money_10k = 0;
        }

        if((money_1t + money_100m + money_10k) != 0){
            output.push({
                start: p.content.search(money_word),
                end: p.content.search(money_word) + money_word.length,
                money: money_1t + money_100m + money_10k
            });
        }
    }
    var refined_output = [];
    output.map(function(obj){
        if(obj != null){
            refined_output.push(obj);
        }
    });

    return [refined_output, moneyList];
};

parser.findFuckingMoney = function(p){
    var moneyRegex = new RegExp('([0-9,]+)여억원', 'g');

    var regArray, output = [];

    while((reqArray = moneyRegex.exec(p.content)) != null){
        var money = parseInt(reqArray[1].replace(",", "")) * 100000000;
        console.log(money);
        output.push({
            start: p.content.search(reqArray[0]),
            end: p.content.search(reqArray[0]) + reqArray[0].length,
            money: money
        });
    }

    return output;
};

parser.match = function(str, c){
    if(c.length == 0) return [];

    var m_list = [];

    while(str.indexOf(c) != -1){
        var m_pos = str.indexOf(c),
            str = str.slice(m_pos+1);

        if(m_list.length != 0){
            m_pos = m_list[m_list.length-1] + m_pos + 1;
        }
        m_list.push(m_pos);
    }

    return m_list;
};

parser.categorize = function(str){
    var f = fs.readFileSync(__dirname + '/category.json', 'utf8');

    var service = JSON.parse(f);
    var category = service.category,
        keywords = service.keywords;

    var article = str.split(' ');
    article.forEach(function(e, i, arr){
        arr[i] = String(e).replace(/^\s+|\s+$/g, '');
    });
    article = article.join('');

    var weight = [], category_index = 0;

    for(i=0; i<category.length; i++){
        weight[i] = 0;
        //keywords[i].push = category[i];
        var matched = [];
        for(j=0; j<keywords[i].length; j++){
            var keyword = keywords[i][j];
            result = parser.match(article, keyword);
            if(result.length > 0){
                matched.push(keywords[i][j]);
            }
            weight[i] += result.length;
        }
        weight[i] = [weight[i], matched.length, i, matched.join(' / ')];
    }

    var weight = weight.sort(function(a, b){return b[0]-a[0]});
    var weight_comp = 0;

    for(var i=0; i<5; i++){
        var cnt = weight[i][0], num = weight[i][1], len = keywords[weight[i][2]].length;
        weight[i][0] = cnt * num;

        if(weight[i][0] > weight_comp){
            //except category_index = 1;...일반공공행정
            if(weight[i][2] != 1){
                category_index = weight[i][2];
                weight_comp = weight[i][0];
            }else{
                if(weight[i][0] > weight_comp * 1.5){
                    category_index = weight[i][2];
                    weight_comp = weight[i][0];
                }
            }
        }
    }

    var sortWeight = weight.sort(function(a, b){return b[0] * b[1] - a[0] * a[1]});
    sortWeight.map(function(obj){
        console.log(category[obj[2]], obj);
    });

    return [category[sortWeight[0][2]], category[sortWeight[1][2]]];
};

parser.findServices = function(str){
    console.log('\n\n--- start find services ---')
    var words = JSON.parse(fs.readFileSync(__dirname + '/services_word.json', 'utf8'));
        services = JSON.parse(fs.readFileSync(__dirname + '/services_info.json', 'utf8'));
    console.log('read file : OK');

    var word_list = [], serv_list = [];

    words.map(function(_word){
        var word = _word.word,
            match = parser.match(str, word),
            count = match.length;

        word_list.push([word, count * _word.weight]);
    });
    console.log('word matching : OK');

    var except = ['서울', '서울시', '사람', '사회', '문제', '문화', '경우', '우리', '소리', '함께', '시간', '인간', '사실', '시대', '다음', '세계', '설계', '공사', '시설', '사업'];

    services.map(function(_service){
        var calc_name = _service.calc_name, weight = 0, check = [];
        calc_name.map(function(_name){
            for(var i=0; i<word_list.length; i++){
                if(_name == word_list[i][0] && _name.length > 1 && except.indexOf(_name) == -1){
                    var _w = word_list[i][1];
                    _w = _w * _name.length * 0.7;
                    if(_name.length == 2){
                        _w = _w / 2;
                    }
                    weight += _w;

                    check.push(word_list[i]);
                    continue;
                }
            }
        });

        serv_list.push({
            name: _service.orig_name,
            list: _service.calc_name,
            ctg1: _service.ctg1,
            weight: weight,
            check: check
        });
    });
    console.log('service matching : OK');
    serv_list.sort(function(a, b){ return b.weight - a.weight });
    console.log('service sorting : OK');

    var output = [], output_ctg = [];

    for(var i=0; i<5; i++){
        output.push(serv_list[i].name);
        output_ctg.push(serv_list[i].ctg1);
        //console.log(serv_list[i].name, serv_list[i].check, serv_list[i].weight);
    }

    console.log('--- finish find services ---\n\n')
    return [output, output_ctg];
};

module.exports = parser;
