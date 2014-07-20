function parser(str){
    function paragraph(str){
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
                content: arr[i]
            };
        });

        return p_list;
    }
    function findMoney(p){
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
    }
    function match(str, c){
        var m_list = [];
        while(str.search(c) != -1){
            var m_pos = str.search(c),
                str = str.slice(m_pos+1);

            if(m_list.length != 0){
                m_pos = m_list[m_list.length-1] + m_pos + 1;
            }
            m_list.push(m_pos);
        }

        return m_list;
    }

    return {
        paragraph: paragraph,
        findMoney: findMoney
    };
}

var parser = parser();

module.exports = parser;
