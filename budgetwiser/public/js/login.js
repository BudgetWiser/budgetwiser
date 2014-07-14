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


Account = {};

Account.initialize = function(){
    this.username = $('.username');
    this.password = $('.password');
    this.submit = $('.submit');
    this.next = $('.next');
    this.inputs = $('input');

    this.error_desc = $('.error-desc');
    this.error_popup = $('#wrapper-error');

    Account.registerHandlers();
    $(Account.error_popup).hide();
};

Account.registerHandlers = function(){
    $(Account.submit).click(function(){Account.login()});
};

Account.login = function(){
    $(Account.inputs).attr('disabled', 'disabled');
    $(Account.submit).addClass('clicked').attr('disabled', 'disabled').html('please wait');

    var username = $(Account.username).val(),
        password = $(Account.password).val(),
        next = $(Account.next).val();

    var url = '/account/login?next=' + next;

    $.ajax({
        type: 'POST',
        url: url,
        data: {
            username: username,
            password: password,
            next: next
        },
        success: function(){
            if(next){
                window.location = next;
            }else{
                window.location = '/';
            }
        },
        error: function(){
            $(Account.inputs).removeAttr('disabled');
            $(Account.submit).html('sign in').removeAttr('disabled').removeClass('clicked');
            Account.error('Please check your username or password');
        }
    });
};

Account.error = function(txt){
    $(Account.error_desc).html(txt);
    Layout.setPos(this.error_popup);
    $(this.error_popup).css({
        'top': 0,
        'margin-top': 0
    });

    $(Account.error_popup).fadeIn(function(){
        setTimeout(function(){
            $(Account.error_popup).fadeOut(function(){
                $(this).hide();
            });
        }, 1000);
    });
};
