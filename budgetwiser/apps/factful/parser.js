var fs = require('fs');

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

parser.findMoney = function(p){
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
    }//end while

    return output;
};

parser.match = function(str, c){
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
        keywords[i].push = category[i];
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
    weight.map(function(obj){
        console.log(category[obj[2]], obj);
    });

    for(var i=0; i<3; i++){
        var cnt = weight[i][0], num = weight[i][1], len = keywords[weight[i][2]].length;
        weight[i][0] = cnt * (cnt + num) / len;

        if(weight[i][0] > weight_comp){
            category_index = weight[i][2];
            weight_comp = weight[i][0];
        }
    }

    return category[category_index];
};

module.exports = parser;
