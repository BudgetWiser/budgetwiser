/*
 * use strict mode
 */
'use strict';

/*
 * Raise error when assert condition fail.
 */
Factful.assert = function(cond, msg){
    if (!cond){
        throw Error(msg || "Assert Fail : no message or inappropriate message");
    }
};

/*
 * Create DOM element
 */
Factful.createElement = function(tag, opts){
    if (typeof(opts) !== 'object' && typeof(opts) !== 'undefined'){
        throw Error("createElement Fail : given opts param is not an object");
    }else{
        var elm = document.createElement(tag);

        if(opts){
            if(opts.id){
                elm.id = opts.id;
            }
            if(opts.class){
                var classList = (opts.class).split(" ");
                classList.map(function(val){
                    elm.classList.add(val);
                });
            }
        }

        /* element function */
        elm.hasClass = function(className){
            var classList = className.split(" ");
            classList.map(function(val){
                if (!elm.classList.contains(val)){
                    return false;
                }
            });
            return true;
        };
        elm.addClass = function(className){
            var classList = className.split(" ");
            classList.map(function(val){
                elm.classList.add(val);
            });
        };
        elm.removeClass = function(className){
            var classList = className.split(" ");
            classList.map(function(val){
                elm.classList.remove(val);
            });
        };

        return elm;
    }
};

/*
 * Find Objects by ID
 */
Factful.findParagraphById = function(_id){
    var pList = Factful.article.paragraphs;
    for(var i=0; i<pList.length; i++){
        if(pList[i]._id == _id){
            return pList[i];
        }
    }
};
Factful.findRangeById = function(_id){
    var pList = Factful.article.paragraphs;
    for(var i=0; i<pList.length; i++){
        var rList = pList[i].ranges;
        for(var j=0; j<rList.length; j++){
            if(rList[j]._id == _id){
                return rList[j];
            }
        }
    }
};

/*
 * Money to String
 */
Factful.moneyToStr = function(money){
    var mStr = [], obj_calc = money;
    if(parseInt(obj_calc/1000000000000) != 0){
        mStr.push(parseInt(obj_calc/1000000000000) + '조');
    }
    obj_calc = obj_calc % 1000000000000;
    if(parseInt(obj_calc/100000000) != 0){
        mStr.push(parseInt(obj_calc/100000000) + '억');
    }
    obj_calc = obj_calc % 100000000;
    if(parseInt(obj_calc/10000) != 0){
        mStr.push(parseInt(obj_calc/10000) + '만');
    }
    mStr = mStr.join(' ');

    return mStr;
};

/*
 * Appendchild to ParentView
 */
Element.prototype.appendChildren = function(children){
    for(var i=0; i<children.length; i++){
        this.appendChild(children[i]);
    }
};
