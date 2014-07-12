var Layout = {};

Layout.initialize = function(){
    Layout.content_wrappers = $('.item-content-wrapper');
    Layout.intro_list = $('.intro-item');
    Layout.next_btn = $('button.next');
    Layout.goto_top_btn = $('button.goto-top');
    Layout.title_box = $('.intro-title');

    Layout.titles = ['', 'about', 'prototypes', 'members', 'contact us'];

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

Members = {};

Members.initialize = function(){
    Members.members = $('.member-item');
    Members.out_links = $('.out-link');
    Members.links = $('.out-link>li>a');
    Members.emails = $('.email');

    Members.onEmptyLink(this.links);
    Members.registerHandlers();
};

Members.registerHandlers = function(){
    $(Members.members).each(function(index, obj){
        $(obj).mouseenter(function(){
            Members.onMouseover(index, this);
        });
        $(obj).mouseleave(function(){
            Members.onMouseout(index, this);
        });
    });
    $(Members.emails).click(function(){Members.copyToClipboard($(this).html())});
};

Members.copyToClipboard = function(text){
    window.prompt("You can copy to clipboard now (Ctrl + C, Enter)", text);
};

Members.onEmptyLink = function(objList){
    $(objList).each(function(index, obj){
        var href = $(obj).attr('href');
        if(href == ''){
            $(obj).removeAttr('href');
            $(obj).addClass('no-link');
        }
    });
};

Members.onEmptyImage = function(obj){
    $(obj).attr('src', '/static/res/profile_default.png');
};

Members.onMouseover = function(index, obj){
    $(Members.out_links[index]).stop().fadeIn(100);
};

Members.onMouseout = function(index, obj){
    $(Members.out_links[index]).stop().fadeOut(100, function(){
        $(this).hide();
    });
};
