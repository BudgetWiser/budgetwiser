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
        this.category = data.category;

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

    var _info_view = Factful.createElement('div');
    _info_view.addClass('factful-budget-info');
    $(this.view_).append(_info_view);
    this.infoView_ = _info_view;

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
            'left': rect.left - offset.left + $(document).scrollLeft(),
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


    // Range Menu
    var last_rect = rects[rects.length - 1];

    var _menuView = Factful.createElement('div');
    _menuView.addClass('factful-article-range-menu');
    $(_menuView).css({
        'top': last_rect.top - offset.top + $(document).scrollTop() + last_rect.height + 4,
        'left': last_rect.left + last_rect.width/2 - 60 - offset.left + $(document).scrollLeft()
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
        'left': last_rect.left + last_rect.width/2 - 150 - offset.left + $(document).scrollLeft()
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

    var _addFactcheckView = Factful.createElement('div');
    _addFactcheckView.addClass('range-add-factcheck-view');
    $(_addFactcheckView).css({
        'top': last_rect.top - offset.top + $(document).scrollTop() + last_rect.height + 4,
        'left': last_rect.left + last_rect.width/2 - 120 - offset.left + $(document).scrollLeft()
    });

    var _addFactcheckScore = Factful.createElement('select');
    _addFactcheckScore.addClass('range-add-factcheck-score');
    _addFactcheckScore.innerHTML = '<option value=0>☆☆☆☆☆</option>\
                                    <option value=1>★☆☆☆☆</option>\
                                    <option value=2>★★☆☆☆</option>\
                                    <option value=3>★★★☆☆</option>\
                                    <option value=4>★★★★☆</option>\
                                    <option value=5>★★★★★</option>';

    var _addFactcheckLink = Factful.createElement('input');
    _addFactcheckLink.addClass('range-add-factcheck-link');
    _addFactcheckLink.setAttribute('type', 'text');

    var _addFactcheckSubmit = Factful.createElement('button');
    _addFactcheckSubmit.addClass('range-add-factcheck-submit');
    _addFactcheckSubmit.innerHTML = '남기기';

    _addFactcheckView.innerHTML = '<h4>신뢰 점수 추가하기</h4>\
                                   <span>이 부분이 사실에 기반한 내용인가요?</span>';
    _addFactcheckView.appendChild(_addFactcheckScore);
    _addFactcheckView.innerHTML += '<h4>그리고,</h4>\
                                    <span>무엇을 근거로 들어 위와 같은 점수를 매겼는지, 링크로 남겨주세요.</span>';
    _addFactcheckView.appendChild(_addFactcheckLink);
    _addFactcheckView.appendChild(_addFactcheckSubmit);

    Factful.article.rangesView_.appendChild(_addFactcheckView);

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
            view_: _addFactcheckView,
            score_: _addFactcheckScore,
            link_: _addFactcheckLink,
            submit_: _addFactcheckSubmit
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

/*
 * Info Object
 */
Factful.Info = function(data){
    if(typeof(data) == 'object'){
        this.name = data.name;
        this.ctg_1 = data.ctg_1;
        this.ctg_3 = data.ctg_3;
        this.graph = {};
        this.st = 'open';
    }
};

Factful.Info.prototype.generateView = function(infoView){
    var _view = infoView;

    var _headerView = Factful.createElement('div');
    _headerView.addClass('factful-budget-header');

    var _titleView = Factful.createElement('h3');
    _titleView.addClass('factful-budget-title');
    _titleView.innerHTML = this.name;

    var _otherBtn = Factful.createElement('button');
    _otherBtn.addClass('factful-budget-other');
    _otherBtn.innerHTML = '이상해요!';

    var _foldBtn = Factful.createElement('button');
    _foldBtn.addClass('factful-budget-fold to-close');
    _foldBtn.innerHTML = '접기';

    _headerView.appendChild(_titleView);
    _headerView.appendChild(_otherBtn);
    _headerView.appendChild(_foldBtn);

    var _deltaView = Factful.createElement('div');
    _deltaView.addClass('factful-budget-delta');

    var _deltaTitleView = Factful.createElement('h4');
    _deltaTitleView.addClass('factful-budget-delta-title');
    _deltaTitleView.innerHTML = '연간 예산 변화';

    var _deltaYearView = Factful.createElement('div');
    _deltaYearView.addClass('factful-budget-delta-year');
    for(var i=this.ctg_1.length-1; i>=0; i--){
        var _yearView = Factful.createElement('div');
        _yearView.innerHTML = this.ctg_1[i].year;
        _deltaYearView.appendChild(_yearView);
    }

    // Draw 2D delta graph
    var _deltaGraphView = Factful.createElement('div');
    _deltaGraphView.addClass('factful-budget-delta-graph');

    var _deltaStage = new Kinetic.Stage({
        container: _deltaGraphView,
        width: 630,
        height: 120
    });
    var _deltaLayer = new Kinetic.Layer();

    // ctg_1 2014,2013,2012,2011,2010
    var pointPos = [], deltaPercent = [];
    var max_money = 0,
        min_money = 0;

    this.ctg_1.forEach(function(obj, i, arr){
        var money = parseInt(obj.money);
        if(money>max_money){
            max_money=money;
        }
        if(money<min_money || min_money==0){
            min_money=money;
        }
        if(i < arr.length - 1){
            var delta = (parseInt(arr[i].money) - parseInt(arr[i+1].money)) / parseInt(arr[i+1].money) * 100;
            if(delta > 0){
                deltaPercent.push('+ ' + Math.abs(delta).toFixed(2) + '%');
            }else{
                deltaPercent.push('- ' + Math.abs(delta).toFixed(2) + '%');
            }
        }
    });
    this.ctg_1.map(function(obj){
        var centerX = 15 + 150 * (obj.year - 2010),
            centerY = 120 - (8 + (parseInt(obj.money) - min_money) / (max_money - min_money) * (120 - 16));
        pointPos.push([centerX, centerY]);
    });
    // Draw line & delta percent
    for(var i=0; i<pointPos.length-1; i++){
        console.log(deltaPercent[i]);
        var startPos = {
            x: pointPos[i][0],
            y: pointPos[i][1]
        };
        var endPos = {
            x: pointPos[i+1][0],
            y: pointPos[i+1][1]
        };

        var line = new Kinetic.Line({
            points: [startPos.x, startPos.y, endPos.x, endPos.y],
            stroke: '#afb4b6',
            strokeWidth: 3,
            lineJoin: 'round'
        });

        var text = new Kinetic.Text({
            x: (startPos.x + endPos.x)/2 - 32,
            y: (startPos.y + endPos.y)/2 - 6,
            text: deltaPercent[i],
            fontSize: 13,
            fontFamily: 'Nanum Gothic',
            fill: '#02c7ff',
            width: 64,
            height: 16
        });
        var textStroke = new Kinetic.Text({
            x: (startPos.x + endPos.x)/2 - 32,
            y: (startPos.y + endPos.y)/2 - 6,
            text: deltaPercent[i],
            fontSize: 13,
            fontFamily: 'Nanum Gothic',
            stroke: '#fff',
            strokeWidth: 5,
            width: 80,
            height: 24
        });

        _deltaLayer.add(line);
        _deltaLayer.add(textStroke);
        _deltaLayer.add(text);
    };
    // Draw point
    this.ctg_1.forEach($.proxy(function(obj, i, arr){
        var obj_money = '', obj_calc = obj.money;
        if(parseInt(obj_calc/1000000000000) != 0){obj_money += (parseInt(obj_calc/1000000000000) + '조 ');}
        obj_calc = obj_calc % 1000000000000;
        if(parseInt(obj_calc/100000000) != 0){obj_money += (parseInt(obj_calc/100000000) + '억 ');}
        obj_calc = obj_calc % 100000000;
        if(parseInt(obj_calc/10000) != 0){obj_money += (parseInt(obj_calc/10000) + '만');}

        var centerX = pointPos[i][0],
            centerY = pointPos[i][1],
            radius = 6;

        var point = new Kinetic.Circle({
            x: centerX,
            y: centerY,
            radius: radius,
            fill: '#fff',
            stroke: '#02c7ff',
            strokeWidth: 4
        });

        var pointInfo = Factful.createElement('div');
        pointInfo.addClass('factful-budget-delta-money');
        pointInfo.innerHTML = '약 ' + obj_money + '원';
        console.log(centerX, centerY);
        $(pointInfo).css({
            'left': centerX,
            'top': centerY
        });
        _view.appendChild(pointInfo);

        point.on('mouseover', function(){
            this.stroke('#676d6f');
            $(pointInfo).stop();
            $(pointInfo).fadeIn(100);
            _deltaLayer.draw();
        });
        point.on('mouseout', function(){
            this.stroke('#02c7ff');
            $(pointInfo).stop();
            $(pointInfo).fadeOut(100, function(){$(this).hide()});
            _deltaLayer.draw();
        });

        _deltaLayer.add(point);
    }, this));
    _deltaStage.add(_deltaLayer);

    _deltaGraphView.appendChild(_deltaYearView);

    _deltaView.appendChild(_deltaTitleView);
    _deltaView.appendChild(_deltaGraphView);

    // More information about budgets ctg_1
    var _moreView = Factful.createElement('div');
    _moreView.addClass('factful-budget-more');

    var _moreTitleView = Factful.createElement('h4');
    _moreTitleView.addClass('factful-budget-more-title');
    _moreTitleView.innerHTML = "올해 '" + this.name + "' 예산 정보";

    var _moreGraphView = Factful.createElement('div');
    _moreGraphView.addClass('factful-budget-more-graph');

    var _moreListView = Factful.createElement('ul');
    _moreListView.addClass('factful-budget-more-list');

    // Draw bar graph
    var _moreStage = new Kinetic.Stage({
        container: _moreGraphView,
        width: 630,
        height: 40
    });
    var _moreLayer = new Kinetic.Layer();
    var _moreRect = new Kinetic.Rect({
        x: 0,
        y: 0,
        width: 630,
        height: 40,
        fill: '#d9d9d9'
    });
    _moreLayer.add(_moreRect);

    this.ctg_3.sort(function(a, b){
        return b.money - a.money;
    });
    var nextPos = 0, nextColor = {h:193, s:100, v:100};
    var thisYear = this.ctg_1[0];
    this.ctg_3.map($.proxy(function(obj){
        var rgb  = this.HSVtoRGB(nextColor);
        var moneyPercent = parseInt(obj.money) / parseInt(thisYear.money) * 100;
        moneyPercent = moneyPercent.toFixed(2) + '%';
        var obj_money = '', obj_calc = obj.money;
        if(parseInt(obj_calc/1000000000000) != 0){obj_money += (parseInt(obj_calc/1000000000000) + '조 ');}
        obj_calc = obj_calc % 1000000000000;
        if(parseInt(obj_calc/100000000) != 0){obj_money += (parseInt(obj_calc/100000000) + '억 ');}
        obj_calc = obj_calc % 100000000;
        if(parseInt(obj_calc/10000) != 0){obj_money += (parseInt(obj_calc/10000) + '만');}
        console.log(obj_money);

        // generate moreListView
        var _item = Factful.createElement('li');
        _item.addClass('factful-budget-more-item');

        var _rect = Factful.createElement('span');
        _rect.addClass('factful-budget-more-item-rect');
        $(_rect).css('background', 'rgb(' + rgb.join(',') + ')');

        var _blah = Factful.createElement('span');
        _blah.addClass('factful-budget-more-item-blah');
        _blah.innerHTML =
            '<span>' + obj.name + '</span>' +
            '(약 ' + obj_money + '원), ' +
            moneyPercent;

        _item.appendChild(_rect), _item.appendChild(_blah);
        _moreListView.appendChild(_item);

        // generate moreGraphView
        var width = parseInt(parseInt(obj.money) / parseInt(thisYear.money) * 630);
        var rect = new Kinetic.Rect({
            x: nextPos,
            y: 0,
            width: width,
            height: 40,
            fill: 'rgb(' + rgb.join(',') + ')'
        });

        rect.on('mouseover', function(){
            this.fill('#ffbf24');
            $(_rect).css('background', '#ffbf24');
            _blah.addClass('sel');
            _moreLayer.draw();
        });
        rect.on('mouseout', function(){
            this.fill('rgb(' + rgb.join(',') + ')');
            $(_rect).css('background', 'rgb(' + rgb.join(',') + ')');
            _blah.removeClass('sel');
            _moreLayer.draw();
        });

        $(_item).bind('mouseover', function(){
            rect.fill('#ffbf24');
            $(_rect).css('background', '#ffbf24');
            _blah.addClass('sel');
            _moreLayer.draw();
        });
        $(_item).bind('mouseout', function(){
            rect.fill('rgb(' + rgb.join(',') + ')');
            $(_rect).css('background', 'rgb(' + rgb.join(',') + ')');
            _blah.removeClass('sel');
            _moreLayer.draw();
        });


        _moreLayer.add(rect);

        nextPos += width, nextColor.v -= 15;
    },this));

    _moreStage.add(_moreLayer);

    _moreView.appendChild(_moreTitleView);
    _moreView.appendChild(_moreGraphView);
    _moreView.appendChild(_moreListView);

    _view.appendChild(_headerView);
    _view.appendChild(_deltaView);
    _view.appendChild(_moreView);

    $('.factful-budget-delta-money').each(function(){
        // posY
        var _obj = $(this);
        var posY = parseFloat(_obj.css('top').split('px').join('')),
            posX = parseFloat(_obj.css('left').split('px').join(''));

        posX = posX + 19 + 16;
        posY = posY + $(_headerView).height() + $(_deltaTitleView).height() + 64 - 18;

        $(this).css({
            'top': posY,
            'left': posX
        });
    });

    this.view_ = _view;

    //for font aliasing, just draw one more.
    _deltaLayer.draw();
    _moreLayer.draw();
};

Factful.Info.prototype.HSVtoRGB = function(h, s, v){
    var r, g, b, i, f, p, q, t;
    if (h && s === undefined && v === undefined) {
        s = h.s, v = h.v, h = h.h;
    }
    h = h/360.0, s = s/100.0, v = v/100.0;
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return [Math.floor(r * 255), Math.floor(g * 255), Math.floor(b * 255)];
}
