/*
 * use strict mode
 */
'use strict';

/*
 * Article object
 */
Factful.Article = function(data){
    if(typeof(data) === 'object'){
        this._id = data._id;
        this.title = data.title;
        this.subtitle = data.subtitle;
        this.date = data.date;
        this.url = data.url;
        this.press = data.press;

        this.paragraphs = [];
    }
};

Factful.Article.prototype.generateView = function(articleView){
    this.view_ = articleView;
    this.view_.addClass('factful-article');

    var _title_view = Factful.createElement('h2');
    _title_view.addClass('factful-article-title');
    _title_view.innerHTML = this.title;
    $(this.view_).append(_title_view);

    if(this.subtitle != ''){
        var _subtitle_view = Factful.createElement('h3');
        _subtitle_view.addClass('factful-article-subtitle');
        _subtitle_view.innerHTML = this.subtitle;
        //$(this.view_).append(_subtitle_view);
    }

    var _info_view = Factful.createElement('div');
    _info_view.addClass('factful-article-info');
    $(this.view_).append(_info_view);

    var _press_view = Factful.createElement('a');
    _press_view.setAttribute('href', this.url);
    _press_view.addClass('factful-article-press');
    _press_view.innerHTML = this.press;
    $(_info_view).append(_press_view);

    var _date = new Date(this.date),
        _date_view = Factful.createElement('span');
    _date_view.addClass('factful-article-date');
    _date_view.innerHTML =
        _date.getFullYear() + '년 ' +
        (_date.getMonth() + 1) + '월 ' +
        _date.getDate() + '일 ' +
        _date.getHours() + ':' + _date.getMinutes();
    $(_info_view).append(_date_view);

    var _paragraphs_view = Factful.createElement('div');
    _paragraphs_view.addClass('factful-article-paragraphs');
    $(this.view_).append(_paragraphs_view);
    this.paragraphsView_ = _paragraphs_view;
};

Factful.Article.prototype.generateParagraphView = function(paragraph){
    var _paragraph = new Factful.Paragraph(paragraph);
    _paragraph.generateView(this.paragraphsView_);

    this.paragraphs.push(_paragraph);
};

/*
 * Paragraph Object
 */
Factful.Paragraph = function(data){
    if(typeof(data) === 'object'){
        this._id = data._id;
        this._article = data._article;
        this.type = data.type;
        this.content = data.content;

        this.ranges = [];
    }
};

Factful.Paragraph.prototype.generateView = function(paragraphsView){
    var _view = Factful.createElement('p');
    _view.addClass('factful-article-paragraph');
    _view.setAttribute('id', this._id);
    _view.innerHTML = this.content;

    if(this.type == 1){
        var _img = Factful.createElement('img');
        _img.setAttribute('src', this.content);
        _img.setAttribute('id', this._id);
        _img.addClass('factful-article-image');

        _view = _img;
    }

    this.view_ = _view;
    $(paragraphsView).append(_view);
};

/*
 * Range Object
 */
Factful.Range = function(data){
    if(typeof(data) === 'object'){
        this._id = data._id;
        this._paragraph = data._paragraph;
        this.start = data.start;
        this.end = data.end;

        this.rels = [];
        this.comments = [];
        this.factchecks = [];
    }
};

Factful.Range.prototype.restoreRange = function(){
    var charIndex = 0,
        range = document.createRange(),
        container = document.getElementById(this._paragraph),
        startNode = this.start, endNode = this.end;

    range.setStart(container, 0);
    range.collapse(true);

    var nodeStack = [container],
        node,
        foundStart = false,
        stop = false;

    while(!stop && (node = nodeStack.pop())){
        if(node.nodeType == 3){
            var nextCharIndex = charIndex + node.length;
            if(!foundStart && startNode >= charIndex && startNode <= nextCharIndex){
                range.setStart(node, startNode - charIndex);
                foundStart = true;
            }
            if(foundStart && endNode >= charIndex && endNode <= nextCharIndex){
                range.setEnd(node, endNode - charIndex);
                stop = true;
            }
            charIndex = nextCharIndex;
        }else{
            var i = node.childNodes.length;
            while(i--){
                nodeStack.push(node.childNodes[i]);
            }
        }
    }

    this._range = range;
};

Factful.Range.prototype.generateView = function(offset){
    this.view_ = [];
    this.backView_ = [];

    var rects = this._range.getClientRects();

    for(var i=0; i<rects.length; i++){
        var rect = rects[i];
        var rect_style = {
            'top': rect.top - offset.top - 2 + $(document).scrollTop(),
            'left': rect.left - offset.left,
            'width': rect.width + 1,
            'height': rect.height + 4
        };
        var _view = Factful.createElement('div');
        _view.addClass('factful-article-range');
        _view.addClass(this._id);
        $(_view).css(rect_style);
        $(_view).css('z-index', parseInt(1000/rect.width));

        var _backView = Factful.createElement('div');
        _backView.addClass('factful-article-range-backview');
        _backView.addClass(this._id);
        $(_backView).css(rect_style);

        if(rects.length >= 2){
            if(i == 0){
                _view.addClass('range-rect-start');
                _backView.addClass('range-rect-start');
            }else if(i == rects.length - 1){
                _view.addClass('range-rect-end');
                _backView.addClass('range-rect-end');
            }else{
                _view.addClass('range-rect-mid');
                _backView.addClass('range-rect-mid');
            }
        }

        Factful.article.rangesView_.appendChild(_view);
        this.view_.push(_view);
        Factful.article.rangesBackView_.appendChild(_backView);
        this.backView_.push(_backView);
    }


    // Range Menu + rightSide views.
    var last_rect = rects[rects.length - 1];

    var _menuView = Factful.createElement('div');
    _menuView.addClass('factful-article-range-menu');
    $(_menuView).css({
        'top': last_rect.top - offset.top + $(document).scrollTop() + last_rect.height + 4,
        'left': last_rect.left + last_rect.width/2 - 60 - offset.left
    });

    var _addCommentBtn = Factful.createElement('button');
    _addCommentBtn.addClass('range-add-comment');
    _addCommentBtn.innerHTML = 'Add Comment';

    var _addFactcheckBtn = Factful.createElement('button');
    _addFactcheckBtn.addClass('range-add-factcheck');
    _addFactcheckBtn.innerHTML = 'Add Factcheck';

    var _addFactcheckReqBtn = Factful.createElement('button');
    _addFactcheckReqBtn.addClass('range-add-factcheck-req');
    _addFactcheckReqBtn.innerHTML = 'Add Factcheck Request';

    _menuView.appendChild(_addCommentBtn);
    _menuView.appendChild(_addFactcheckBtn);
    _menuView.appendChild(_addFactcheckReqBtn);

    Factful.article.rangesView_.appendChild(_menuView);

    var _addCommentView = Factful.createElement('div');
    _addCommentView.addClass('range-add-comment-view');
    _addCommentView.innerHTML = '<h4>댓글 입력하기</h4>';
    $(_addCommentView).css({
        'top': last_rect.top - offset.top + $(document).scrollTop() + last_rect.height + 4,
        'left': last_rect.left + last_rect.width/2 - 150 - offset.left
    });

    var _addCommentTextarea = Factful.createElement('textarea');
    _addCommentTextarea.addClass('range-add-comment-textarea');
    _addCommentTextarea.setAttribute('placeholder', '선택한 부분에 대해, 질문 혹은 의견이 있으시면 남겨주세요.');

    var _addCommentSubmit = Factful.createElement('button');
    _addCommentSubmit.addClass('range-add-comment-submit');
    _addCommentSubmit.innerHTML = '남기기';

    _addCommentView.appendChild(_addCommentTextarea);
    _addCommentView.appendChild(_addCommentSubmit);
    Factful.article.rangesView_.appendChild(_addCommentView);

    this.menuView_ = {
        view_: _menuView,
        addComment: {
            open_: _addCommentBtn,
            view_: _addCommentView,
            textbox_: _addCommentTextarea,
            submit_: _addCommentSubmit
        },
        addFactcheck: {
            open_: _addFactcheckBtn,
            //view_: _addFactcheckVeiw
        },
        addFactcheckReq: {
            open_: _addFactcheckReqBtn,
            //view_: _addFactcheckReqView
        }
    };
};

Factful.Range.prototype.eventHandlers = function(){
    var _r = this;
    this.view_.map(function(_obj){
        $(_obj).bind('mouseenter', {_range: _r}, Factful.e.enterRange);
        $(_obj).bind('mouseleave', {_range: _r}, Factful.e.leaveRange);
        $(_obj).bind('click', {_range: _r}, Factful.e.openRangeMenu);
    })
};

Factful.Range.prototype.check = function(){
    try{
        var range = window.getSelection().getRangeAt(0),
            sp = range.startContainer.parentElement,
            ep = range.endContainer.parentElement;

        if(sp.id == ep.id
           && $(sp).hasClass('factful-article-paragraph')
           && range.toString() !== ''){
            return {
                state: true,
                range: range
            };
        }else{
            return {
                state: false
            };
        }
    }catch(err){
        //throw Error(err);
        return {
            state: false
        };
    }
};

Factful.Range.prototype.findSimilarRange = function(rList, next){
    var bound = 1;
    var _r = this, _obj = this;

    rList.map(function(rObj){
        var diff_start = Math.abs(rObj.start - _r.start),
            diff_end = Math.abs(rObj.end - _r.end);

        if(diff_start <= bound && diff_end <= bound){
            _obj = rObj;
        }
    });

    if(_obj._id){
        _obj = Factful.findRangeById(_obj._id);
    }

    next(_obj);
};

Factful.Range.prototype.normalize = function(){
    var content = this._range.toString();
    var sc = content.split(" "), empt_start = 0, empt_end = 0;

    sc.forEach(function(e, i, arr){
        if(e == '' && i == empt_start){
            empt_start++;
        }
    });
    sc.reverse();
    sc.forEach(function(e, i, arr){
        if(e == '' && i == empt_end){
            empt_end++;
        }
    });

    if(empt_start > 0 || empt_end > 0){
        this.start += empt_start;
        this.end -= empt_end;
        this.restoreRange();
    }
};

Factful.Range.prototype.remove = function(){
    this.view_.map(function(_obj){$(_obj).remove()});
    this.backView_.map(function(_obj){$(_obj).remove()});
};

/*
 * Rel Object
 */
Factful.Rel = function(data){
    if(typeof(data) === 'object'){
        this._id = data._id;
        this._range = data._range;
        this.keyword = data.keyword;
        this.info = data.info;
    }
};

Factful.Rel.prototype.generateView = function(range){
    var _rangeView = range.view_;

    _rangeView.map(function(rv){rv.addClass('factful-article-range-rel')});
/*
    var text = _range.toString(),
        elm = Factful.createElement('b');

    elm.innerHTML = text;
    elm.addClass('factful-article-rel');
    elm.setAttribute('id', range._id);

    _range.deleteContents();
    _range.insertNode(elm);
    */
};

Factful.Rel.prototype.eventHandlers = function(){
    var _range = Factful.findRangeById(this._range);

    _range.view_.map(function(_rangeView){
        /*$(_rangeView).click(function(){
            alert(_range._id);
        });*/
    });
};
