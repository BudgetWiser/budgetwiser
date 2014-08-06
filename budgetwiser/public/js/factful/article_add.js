var Input = {};

Input.initialize = function(){
    this.year = $('.date-field.year');
    this.month = $('.date-field.month');
    this.day = $('.date-field.day');
    this.hour = $('.date-field.hour');
    this.minute = $('.date-field.minute');

    this.title = $('.title-field');
    this.subtitle = $('.subtitle-field');
    this.press = $('.press-field');
    this.content = $('.content-field');
    this.images = $('.images-field');
    this.url = $('.url-field');

    this.submit = $('.submit');

    Input.dateTime();
    Input.registerHandlers();
};

Input.registerHandlers = function(){
    $(Input.submit).click(function(){Input.sendForm()});
};

Input.dateTime = function(){
    var year_list = [
        '2010', '2011', '2012', '2013', '2014'
    ];

    for(var i=0; i<year_list.length; i++){
        var tag =
            '<option value="' + year_list[i] + '">' +
                year_list[i] +
            '</option>';

        $(Input.year).append(tag);
    }

    for(var i=1; i<=12; i++){
        var tag =
            '<option value="' + i + '">' +
                i +
            '</option>';

        $(Input.month).append(tag);
    }

    for(var i=1; i<=31; i++){
        var tag =
            '<option value="' + i + '">' +
                i +
            '</option>';

        $(Input.day).append(tag);
    }

    for(var i=0; i<=24; i++){
        var tag =
            '<option value="' + i + '">' +
                i +
            '</option>';

        $(Input.hour).append(tag);
    }

    for(var i=0; i<=59; i++){
        var tag =
            '<option value="' + i + '">' +
                i +
            '</option>';

        $(Input.minute).append(tag);
    }
};

Input.sendForm = function(){
    var date = Input.year.val() + '-' + Input.month.val() + '-' + Input.day.val() + ' ' + Input.hour.val() + ':' + Input.minute.val();
    var images = [];

    for(var i=0; i<Input.images.length; i++){
        var path = $(Input.images[i]).val();
        images.push(path);
    }

    var data = {
        date: date,
        press: Input.press.val(),
        title: Input.title.val(),
        subtitle: Input.subtitle.val(),
        content: Input.content.val(),
        url: Input.url.val()
    };

    $.ajax({
        type: 'POST',
        url: '/factful/add/article',
        data: data,
        success: function(obj){
            console.log('success', obj.article);
        },
        error: function(){
            console.log('error!');
        }
    });
};
