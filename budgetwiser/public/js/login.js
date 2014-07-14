Layout = {};

Layout.initialize = function(){
    this.wrapper = $('#wrapper-login');

    Layout.setPos(this.wrapper);
    Layout.registerHandlers();
};

Layout.registerHandlers = function(){
};

Layout.setPos = function(obj){
    $(obj).css({
        'position': 'absolute',
        'top': '50%',
        'left': '50%',
        'margin-top': -$(obj).height()/2 - 10,
        'margin-left': -$(obj).width()/2
    });
};
