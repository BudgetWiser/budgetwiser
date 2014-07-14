Layout = {};

Layout.initialize = function(){
    this.wrapper = $('#wrapper-register');

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
    this.username = $('.username>input');
    this.password = $('.password>input');
    this.nickname = $('.nickname>input');
    this.email = $('.email>input');
    this.submit = $('.submit');
    this.next = $('.next');
    this.inputs = $('input');

    this.error_desc = $('.error-desc');
    this.error_popup = $('#wrapper-error');

    this.email_regexp = /^([\.0-9a-zA-Z_-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/mi;

    Account.registerHandlers();
    $(Account.error_popup).hide();
};

Account.registerHandlers = function(){
    $(Account.submit).click(function(){Account.register()});
};

Account.register = function(){
    $(Account.inputs).attr('disabled', 'disabled');
    $(Account.submit).addClass('clicked').attr('disabled', 'disabled').html('please wait');

    var username = $(Account.username).val(),
        password = $(Account.password[0]).val(),
        nickname = $(Account.nickname).val(),
        email = $(Account.email).val(),
        next = $(Account.next).val();

    var check = pw_check = email_check = true;

    $(Account.inputs).each(function(){
        if($(this).val() == ''){
            if($(this).attr('class') != 'next'){
                check = false;
            }
        }
    });
    if($(Account.password[0]).val() != $(Account.password[1]).val()){
        pw_check = false;
    }
    if(!Account.email_regexp.test(email)){
        email_check = false;
    }

    if(check && pw_check && email_check){
        var url = '/register?next=' + next;

        $.ajax({
            type: 'POST',
            url: url,
            data: {
                username: username,
                password: password,
                nickname: nickname,
                email: email,
                next: next
            },
            success: function(){
                if(next){
                    window.location = next;
                }else{
                    window.location = '/';
                }
            },
            error: function(xhr){
                $(Account.inputs).removeAttr('disabled');
                $(Account.submit).removeClass('clicked').removeAttr('disabled').html('register');
                Account.error(xhr.responseJSON.error);
            }
        });
    }else{
        if(!check){
            Account.error('You should input all information, please check');
        }else if(!pw_check){
            Account.error('Password confirm error, please check');
        }else if(!email_check){
            Account.error('Email address is not valid');
        }
    }

};

Account.error = function(txt){
    $(Account.error_desc).html(txt);
    Layout.setPos(Account.error_popup);
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
