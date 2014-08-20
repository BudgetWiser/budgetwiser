/*
 * use strict mode
 */
'use strict';

/*
 * Comment object
 */
Factful.Comment = function(data){
    if(typeof(data) === 'object'){
        this._id = data._id;
        this._user = data._user;
        this._range = data._range;
        if(data._comment){
            this._comment = data._comment;
        }else{
            this.comments = [];
        }

        this.date = data.date;
        this.content = data.content;
        this.ref = data.ref;
    }
};

Factful.Comment.prototype.generateView = function(commentsView){
    this.parentView_ = commentsView;
};

/*
 * RangeInfo object
 */
Factful.RangeInfo = function(data){
    if(typeof(data) === 'object'){
        this._range = data._range;
        this.money = data.money;
    }
};

Factful.RangeInfo.prototype.getRelated = function(next){
    $.ajax({
        url: '/factful/api',
        type: 'GET',
        data: { type: 'budget', budget: this.money, ctg: 'money' },
        success: $.proxy(function(objList){
            console.log(this);
            if(typeof(objList) === 'object'){
                this.related = objList;
            }else{
                this.related = [];
            }

            if(next) next();
        }, this),
        error: function(xhr){
            throw Error(xhr);
        }
    });
};

Factful.RangeInfo.prototype.generateView = function(commentsView){
    var _parentView = commentsView;

    var _view = Factful.createElement('div');
    _view.addClass('factful-range-info');

    var _titleView = Factful.createElement('h4');
    _titleView.addClass('factful-range-info-title');
    _titleView.innerHTML =
        '"약 ' + Factful.moneyToStr(this.money) + '원"' +
        '<span>과 관련된 예산들</span>';
    /*
    var _subtitleView = Factful.createElement('h5');
    _subtitleView.addClass('factful-range-info-subtitle');
    _subtitleView.innerHTML = '과 관련된 예산들';
    */
    var _listView = Factful.createElement('ul');
    _listView.addClass('factful-range-info-list');

    this.related.map(function(obj){
        var _itemView = Factful.createElement('li');
        _itemView.addClass('factful-range-info-item');
        _itemView.innerHTML =
            '<b>' + obj.name + '</b><br>' +
            '(약 ' + Factful.moneyToStr(obj.money) + '원, ';
        switch(obj.category){
            case 1: _itemView.innerHTML += '대분류)'; break;
            case 2: _itemView.innerHTML += '중분류)'; break;
            case 3: _itemView.innerHTML += '소분류)'; break;
        }
        _listView.appendChild(_itemView);
    });
    if(this.related.length == 0){
        _listView.innerHTML = '관련된 항목이 없습니다.';
    }

    _view.appendChildren([
        _titleView,
        //_subtitleView,
        _listView
    ]);
    $(_parentView).prepend(_view);

    this.view_ = _view;
};
