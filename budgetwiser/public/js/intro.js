var Layout = {};

Layout.initialize = function(){
    Layout.content_wrappers = $('.item-content-wrapper');
    Layout.intro_list = $('.intro-item');
    Layout.next_btn = $('button.next');
    Layout.goto_top_btn = $('button.goto-top');
    Layout.title_box = $('.intro-title');

    Layout.titles = ['', 'about', 'prototypes', 'members'];

    Layout.resize();
    Layout.changeTitle();
    Layout.registerHandlers();
};

Layout.registerHandlers = function(){
    $(Layout.next_btn).click(function(){Layout.nextPage()});
    $(Layout.goto_top_btn).click(function(){
        Layout.scrollAnimate($('body'), 0, 400);
    });
    $(window).resize(function(){Layout.resize()});
    $(window).scroll(function(){
        Layout.changeTitle()
    });
};

Layout.resize = function(){
    Layout.scroll_unit = $(window).height();
    Layout.setPos(Layout.content_wrappers);
    Layout.page_num = parseInt($(window).scrollTop() / Layout.scroll_unit);

    var page_num = parseInt($(window).scrollTop() / Layout.scroll_unit + 0.4);
    Layout.title_box.html(Layout.titles[page_num]);

};

Layout.setPos = function(obj){
    $(obj).each(function(){
        var size = {
            width: $(this).width(),
        };

        $(this).css({
            'top': '50%',
            'left': '50%',
            'margin-top': -$(this).height()/2 - 10,
            'margin-left': -$(this).width()/2
        });
    });
};

Layout.nextPage = function(){
    var scroll_pos = $(window).scrollTop(),
        scroll_unit = $(window).height();

    var scroll_limit = ($(Layout.intro_list).length - 1) * scroll_unit;

    if(scroll_pos < scroll_limit){
        var page_num = parseInt(scroll_pos / scroll_unit);
        Layout.scrollAnimate($('body'), scroll_unit * (page_num + 1), 500);
    }
};

Layout.prevPage = function(){
    var scroll_pos = $(window).scrollTop(),
        scroll_unit = $(window).height();

    var scroll_limit = 0;

    if(scroll_pos > scroll_limit){
        var page_num = parseInt(scroll_pos / scroll_unit);
        Layout.scrollAnimate($('body'), scroll_unit * (page_num - 1), 500);
    }
};

Layout.scrollAnimate = function(obj, scrollTo, _dur){
    var dur = 1000;
    if(_dur){
        dur = _dur;
    }
    $(obj).animate({
        scrollTop: scrollTo
    }, dur);
};

Layout.changeTitle = function(){
    var scroll = $(window).scrollTop(),
        page_num = parseInt(scroll / Layout.scroll_unit + 0.3);

    if(page_num != Layout.page_num){
        Layout.page_num = page_num;

        $(Layout.title_box).stop();
        $(Layout.title_box).fadeOut(150, function(){
            $(this).html(Layout.titles[page_num]);
            $(this).fadeIn(150, function(){
            });
        });
    }
};
