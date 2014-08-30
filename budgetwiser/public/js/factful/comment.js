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
        if(!this._user){
            this._user = {};
            this._user.nickname = 'anonymous';
            this._user.username = 'anonymous';
        }

        this.date = data.date;
        this.content = data.content;
        this.ref = data.ref;
        this.symp = data.symp;//list
        this.child = data.child;
    }
};

Factful.Comment.prototype.generateView = function(commentsView){
    var _parentView = commentsView;

    var _view = Factful.createElement('div');
    _view.addClass('factful-comment-item');

    var _profileView = Factful.createElement('div');
    _profileView.addClass('factful-comment-profile');

    var _imageView = Factful.createElement('img'), _imageURL;
    if(!this._user.image) _imageURL = '/static/res/factful/default_profile.png';
    _imageView.addClass('factful-comment-profile-image');
    _imageView.setAttribute('src', _imageURL);

    var _usernameView = Factful.createElement('b');
    _usernameView.addClass('factful-comment-profile-username');
    _usernameView.innerHTML = this._user.nickname + ' (' + this._user.username + ')';

    var _dateView = Factful.createElement('span');
    _dateView.addClass('factful-comment-date');
    _dateView.innerHTML = this.date;

    _profileView.appendChildren([
        _imageView,
        _usernameView,
        _dateView
    ]);

    var _contentView = Factful.createElement('div');
    _contentView.addClass('factful-comment-content');
    _contentView.innerHTML = this.content;

    var _refView = Factful.createElement('div');
    _refView.addClass('factful-comment-ref');
    _refView.innerHTML = this.ref;

    var _buttonView = Factful.createElement('div');
    _buttonView.addClass('factful-comment-button');

    var _sympBtn = Factful.createElement('button');
    _sympBtn.addClass('factful-comment-button-symp');
    _sympBtn.innerHTML = '<span>공감하기</span> ' + this.symp.length + '명';

    var _addBtn = Factful.createElement('button');
    _addBtn.addClass('factful-comment-button-add');
    _addBtn.innerHTML = '<span>댓글달기</span> ' + this.child + '명';

    this.buttonView_ = _buttonView;
    _buttonView.appendChild(_sympBtn);
    this.sympBtn_ = _sympBtn;
    if(!this._comment){
        _buttonView.appendChild(_addBtn);
        this.addBtn_ = _addBtn;
    }

    _view.appendChildren([
        _profileView,
        _contentView
    ]);
    if(typeof(this.ref) !== 'undefined') _view.appendChild(_refView);
    _view.appendChild(_buttonView);

    _parentView.appendChild(_view);

    this.view_ = _view;
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
        '<span>과 비슷한 크기의 예산들</span>';

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

    var _addItemView = Factful.createElement('button');
    _addItemView.addClass('factful-range-info-add');
    _addItemView.innerHTML = '정보 추가하기';

    if(this.related.length == 0){
        _listView.innerHTML = '관련된 항목이 없습니다.';
        this.view_ = null
    }else{
        _view.appendChildren([
            _titleView,
            _listView
            //_addItemView
        ]);
        $(_parentView).prepend(_view);

        this.view_ = _view;
    }
};

/*
 * Factcheck object
 */
Factful.Factcheck = function(data){
    if(typeof(data) === 'object'){
    }
};

/*
 * Factcheck Request Object
 */
Factful.FactcheckReq = function(data){
    if(typeof(data) === 'object'){
        //this._userList = [];
        this._range = data._range;
    }
};

Factful.FactcheckReq.prototype.generateView = function(commentsView){
    var _parentView = commentsView;

    var _view = Factful.createElement('div');
    _view.addClass('factful-factcheck-req');
    if($(_parentView).children().length > 0){
        $(_view).css('margin-bottom', '12px');
    }

    var _reqView = Factful.createElement('div');
    _reqView.addClass('factful-factcheck-req-content');
    _reqView.innerHTML = '사실 확인 요청 <span>' + this._userList.length + '명</span>';

    _view.appendChild(_reqView);
    $(_parentView).prepend(_view);

    this.view_ = _view;
};
