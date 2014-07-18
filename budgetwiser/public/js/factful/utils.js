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
    if (typeof(opts) !== 'object'){
        throw Error("createElement Fail : given opts param is not an object");
    }else{
        var elm = document.createElement(tag);

        if(opts.id){
            elm.id = opts.id;
        }
        if(opts.class){
            var classList = (opts.class).split(" ");
            classList.map(function(val){
                elm.classList.add(val);
            });
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
