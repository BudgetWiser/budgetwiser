Factful.e = {}, Factful.m = {};

Factful.e.checkRange = function(){
    var _tempRange = new Factful.Range(),
        _ch = _tempRange.check();

    if(_ch.state){
        $(Factful.leftSide).unbind('mouseup', Factful.e.checkRange);

        var _r = _ch.range.cloneRange();
        _tempRange._range = _r;
        _tempRange._paragraph = _r.startContainer.parentElement.id;

        var _pre = _r.cloneRange();
        _pre.selectNodeContents(_r.startContainer.parentElement);
        _pre.setEnd(_r.startContainer, _r.startOffset);

        _tempRange.start = _pre.toString().length;
        _tempRange.end = _tempRange.start + _r.toString().length;
        _tempRange.normalize();

        window.getSelection().removeAllRanges();

        // Find Similar Range from server
        $.ajax({
            url: '/factful/api',
            type: 'GET',
            data: { _id: _tempRange._paragraph, type: 'ranges'},
            success: function(objList){
                _tempRange.findSimilarRange(objList, function(_obj){
                    if(!_obj._id){
                        _obj._id = 'temp-range';
                        _obj.generateView(Factful.content.offset());
                    }
                    Factful.e.openRangeMenu({data:{_range: _obj}});
                });
            },
            error: function(xhr){
                throw Error(xhr);
            }
        });
    }else{
        console.log('no range');
    }
};

Factful.e.enterRange = function(e){
    var _r = e.data._range;
    var overStyle = 'rgba(0, 132, 255, .15)';

    _r.backView_.map(function(_obj){
        $(_obj).css('background', overStyle);
    });
};

Factful.e.leaveRange = function(e){
    var _r = e.data._range;
    var leaveStyle = 'transparent';

    _r.backView_.map(function(_obj){
        $(_obj).css('background', leaveStyle);
    });
};

Factful.e.openRangeMenu = function(e){
    var _r = e.data._range;
    console.log('aa');
    var openStyle = 'rgba(255, 228, 0, .5)';
    if(Factful.article.activeRange_){
        //showComments
        if($(e.currentTarget).hasClass('factful-article-range')){
            if(!$(_r.view_).hasClass('temp-range')){
                if(Factful.e.openedRange !== _r){
                    Factful.e.gotoComments(_r);
                }
            }
        }
        Factful.e.closeRangeMenu(Factful.article.activeRange_);
    }else{
        //showComments
        if($(e.currentTarget).hasClass('factful-article-range')){
            if(!$(_r.view_).hasClass('temp-range')){
                if(Factful.e.openedRange !== _r){
                    Factful.e.gotoComments(_r);
                }
            }
        }
    }

    // unbind gotoRange event
    var commentsView = Factful.comments.groups[_r._id];
    if(commentsView){
        $(commentsView.view_).unbind('click', Factful.e.gotoRange);
        $(commentsView.view_).unbind('mouseenter', Factful.e.inCommentsGroup);
        $(commentsView.view_).unbind('mouseleave', Factful.e.outCommentsGroup);
    }

    Factful.article.activeRange_ = e;

    _r.backView_.map(function(_obj){
        $(_obj).css('background', openStyle);
    });
    _r.view_.map(function(_obj){
        $(_obj).unbind('mouseenter', Factful.e.enterRange);
        $(_obj).unbind('mouseleave', Factful.e.leaveRange);
        $(_obj).unbind('click', Factful.e.openRangeMenu);
        //
        $(_obj).bind('click', {_range: _r}, Factful.e.closeRangeMenu);
        //
        $(_obj).addClass('active-range');
    });

    $(Factful.leftSide).bind('mousedown.closeRange', {_range: _r}, function(e){
        if($(e.target).hasClass('factful-article-ranges')){
            Factful.e.closeRangeMenu(e);
        }
        if($(e.target).hasClass('factful-article-range') && $(e.target).hasClass('temp-range')){
            Factful.e.closeRangeMenu(e);
        }
    });

    // RangeMenu Events
    $(_r.menuView_.view_).fadeIn(150);
    $(_r.menuView_.addComment.open_).bind('click', {_range: _r}, Factful.e.openAddComment);
    $(_r.menuView_.addFactcheck.open_).bind('click', {_range: _r}, Factful.e.openAddFactcheck);
    $(_r.menuView_.addFactcheckReq.open_).bind('click', {_range: _r}, Factful.e.openAddFactcheckReq);

};

Factful.e.closeRangeMenu = function(e){
    console.log('closeRangeMenu');

    var _r = e.data._range;
    var closeStyle = 'transparent';

    _r.backView_.map(function(_obj){
        $(_obj).css('background', closeStyle);
    });
    _r.view_.map(function(_obj){
        $(_obj).unbind('click', Factful.e.closeRangeMenu);
        //
        $(_obj).bind('mouseenter', {_range: _r}, Factful.e.enterRange);
        $(_obj).bind('mouseleave', {_range: _r}, Factful.e.leaveRange);
        $(_obj).bind('click', {_range: _r}, Factful.e.openRangeMenu);
        //
        $(_obj).removeClass('active-range');
    });

    if(_r._id == 'temp-range'){
        _r.remove();
    }

    // bind gotoRange event
    var commentsView = Factful.comments.groups[_r._id];
    if(commentsView){
        $(commentsView.view_).bind('click', {_range: _r}, Factful.e.gotoRange);
        $(commentsView.view_).bind('mouseenter', {_view: commentsView.view_}, Factful.e.inCommentsGroup);
        $(commentsView.view_).bind('mouseleave', {_view: commentsView.view_}, Factful.e.outCommentsGroup);
    }

    Factful.article.activeRange_ = '';

    //$(Factful.leftSide).bind('mouseup', Factful.e.checkRange);
    $(Factful.leftSide).unbind('mousedown.closeRange');

    // RangeMenu Events
    $(_r.menuView_.view_).fadeOut(150, function(){$(this).hide()});
    $(_r.menuView_.addComment.view_).fadeOut(150, function(){$(this).hide()});
    $(_r.menuView_.addComment.open_).unbind('click', Factful.e.openAddComment);
    $(_r.menuView_.addFactcheck.view_).fadeOut(150, function(){$(this).hide()});
    $(_r.menuView_.addFactcheck.open_).unbind('click', Factful.e.openAddFactcheck);
    $(_r.menuView_.addFactcheckReq.open_).unbind('click', Factful.e.openAddFactcheckReq);

    // Close Comment Groups
    if(!$(_r.view_).hasClass('temp-range')) Factful.e.closeCommentsGroup(_r);
};

Factful.e.openAddComment = function(e){
    console.log('openAddComment');

    var _r = e.data._range;

    $(_r.menuView_.view_).fadeOut(150, function(){$(this).hide()});
    $(_r.menuView_.addComment.view_).fadeIn(150);

    $(_r.menuView_.addComment.submit_).unbind('click');
    $(_r.menuView_.addComment.submit_).bind('click', {_range: _r}, Factful.e.addComment);
};

Factful.e.openAddFactcheck = function(e){
    console.log(e.data._range._id, 'openAddFactcheck');

    var _r = e.data._range;

    $(_r.menuView_.view_).fadeOut(150, function(){$(this).hide()});
    $(_r.menuView_.addFactcheck.view_).fadeIn(150);

    $(_r.menuView_.addFactcheck.submit_).unbind('click');
    $(_r.menuView_.addFactcheck.submit_).bind('click', {_range: _r}, Factful.e.addFactcheck);
};

Factful.e.openAddFactcheckReq = function(e){
    Factful.e.addFactcheckReq(e.data._range);
};

Factful.e.addComment = function(e){
    var _range = e.data._range;

    Factful.e.saveRange(_range, function(_r){
        Factful.e.saveComment(_r);
    });
};

Factful.e.addFactcheck = function(e){
    var _range = e.data._range;

    Factful.e.saveRange(_range, function(_r){
        Factful.e.saveFactcheck(_r);
    });

};

Factful.e.addFactcheckReq = function(_range){
    Factful.e.saveRange(_range, function(_r){
        Factful.e.saveFactcheckReq(_r);
    });
};

Factful.e.saveRange = function(_range, callback){
    var _r = _range;

    if(_r._id == 'temp-range'){
        var data = {
            _paragraph: _r._paragraph,
            start: _r.start,
            end: _r.end
        };

        var save = $.ajax({
            type: 'POST',
            url: '/factful/add/range',
            data: data
        });

        save.done(function(obj){
            _r._id = obj.range._id;

            if (callback) callback(_r);
        });

        save.fail(function(xhr){
            console.log(xhr.responseText);
        });
    }else{
        if (callback) callback(_r);
    }
};

Factful.e.saveComment = function(_range, callback){
    var _r = _range;

    var data = {
        _range: _r._id,
        content: $(_r.menuView_.addComment.textbox_).val()
    };

    var save = $.ajax({
        type: 'POST',
        url: '/factful/add/comment',
        data: data
    });

    save.done(function(obj){
        if (callback) callback(obj);

        $(_r.menuView_.addComment.textbox_).val('');
        Factful.e.closeRangeMenu({data: {_range: _r}});

        alert('comment is saved!');
    });

    save.fail(function(xhr){
        console.log(xhr.responseText);
    });
};

Factful.e.saveCommentSymp = function(_comment, callback){
    var _c = _comment, st;

    if($(_c.sympBtn_).prop('disabled')){
        st = true; //add
    }else{
        st = false; //remove
    }

    var data = {
        _comment: _c._id,
        st: st
    };

    var save = $.ajax({
        type: 'POST',
        url: '/factful/add/commentsymp',
        data: data
    });

    save.done(function(obj){
        if (callback) callback(obj);

        if(st){
            $(_c.sympBtn_).prop('disabled', true).addClass('disabled');
            _c.symp.push(obj.username);
            _c.sympBtn_.innerHTML = '<span>공감취소</span> ' + _c.symp.length + '명';
        }else{
            $(_c.sympBtn_).prop('disabled', false).removeClass('disabled');
            _c.symp.removeItem(obj.username);
            _c.sympBtn_.innerHTML = '<span>공감하기</span> ' + _c.symp.length + '명';
        }
    });
};

Factful.e.saveFactcheck = function(_range, callback){
    var _r = _range;
    var score = $(_r.menuView_.addFactcheck.view_).children()[2];

    var data = {
        _range: _r._id,
        score: $(score).val(),
        ref: $(_r.menuView_.addFactcheck.link_).val()
    };

    var save = $.ajax({
        type: 'POST',
        url: '/factful/add/factcheck',
        data: data
    });

    save.done(function(obj){
        if (callback) callback(obj);

        $(_r.menuView_.addFactcheck.score_).val('');
        $(_r.menuView_.addFactcheck.link_).val('');
        Factful.e.closeRangeMenu({data: {_range: _r}});

        alert('Your factchecking is saved successfully.')
    });

    save.fail(function(xhr){
        console.log(xhr.responseText);
    });
};

Factful.e.saveFactcheckReq = function(_range, callback){
    var _r = _range;

    var data = {
        _range: _r._id
    };

    var save = $.ajax({
        type: 'POST',
        url: '/factful/add/factcheckreq',
        data: data
    });

    save.done(function(obj){
        if (callback) callback(obj);

        Factful.e.closeRangeMenu({data: {_range: _r}});

        if(obj.statusCode == 0){
            alert('Requested!');
        }else if(obj.statusCode == 1){
            alert('You already requested about this phrase.');
        }
    });

    save.fail(function(xhr){
        console.log(xhr.responseText);
    });
};

Factful.e.gotoComments = function(_range){
    console.log('gotoComments');
    var _r = _range,
        _g = Factful.comments.groups[_r._id];

    var _op = $('.factful-comments-group.opened'),
        _i1 = $('.factful-comments-group').index($(_op)),
        _i2 = $('.factful-comments-group').index($(_g.view_));
    var dlt = 0;
    if(_i1 != -1 && _i1 < _i2){
        dlt = _op.height() - $(_op.children()[0]).height() - 8 * _op.children().length - 26;
        if($(_op.children()[0]).hasClass('factful-factcheck-req') || $(_op.children()[0]).hasClass('factful-factcheck-score')){
            dlt -= $(_op.children()[1]).height() + 8 + 30;
        }
    }

    var pos = $(_r.view_[0]).offset().top - $(Factful.rightSide).offset().top - $(_g.view_).position().top - 24 + dlt;

    $(Factful.comments.view_).animate({
        'top': pos
    }, 300, function(){
        Factful.e.openCommentsGroup(_r);
    });
};

Factful.e.gotoRange = function(e){
    console.log('gotoRange');
    var _r = e.data._range,
        _g = Factful.comments.groups[_r._id];

    var _op = $('.factful-comments-group.opened'),
        _i1 = $('.factful-comments-group').index($(_op)),
        _i2 = $('.factful-comments-group').index($(_g.view_));
    var dlt = 0;
    if(_i1 != -1 && _i1 < _i2){
        dlt = _op.height() - $(_op.children()[0]).height() - 8 * _op.children().length - 26;
        if($(_op.children()[0]).hasClass('factful-factcheck-req') || $(_op.children()[0]).hasClass('factful-factcheck-score')){
            dlt -= $(_op.children()[1]).height() + 8 + 30;
        }
    }

    var pos = $(_r.view_[0]).offset().top - $(Factful.rightSide).offset().top - $(_g.view_).position().top - 24 + dlt;

    Factful.e.openRangeMenu(e);
    $(Factful.comments.view_).animate({
        'top': pos
    }, 300, function(){
        Factful.e.openCommentsGroup(_r);
    });

    $('html, body').animate({
        scrollTop: $(_r.view_[0]).offset().top - 200
    }, 300);
};

Factful.e.openCommentsGroup = function(_range){
    console.log('open comments group');
    if(Factful.e.openedRange){
        Factful.e.closeCommentsGroup(Factful.e.openedRange);
        Factful.e.openedRange = _range;
    }else{
        Factful.e.openedRange = _range;
    }

    var _r = _range,
        _g = Factful.comments.groups[_r._id];

    var _comments = _g.items;

    _g.view_.removeClass('closed');
    _g.view_.addClass('opened');

    for(var i=0; i<_comments.length; i++){
        var _comment = _comments[i];
        $(_comment.buttonView_).slideDown(100, function(){
            $(this).css('display', 'inline-block');
        });
        if(i > 0 && !$(_comment.view_).hasClass('factful-range-info')){
            $(_comment.contentView_).css('height', 'auto');
            $(_comment.view_).stop().animate({
                'margin-top': 12
            }, 200);
        }
    }
    $('.factful-comments-group.opened').stop().animate({
        'opacity': 1
    }, 200);
    $('.factful-comments-group.closed').stop().animate({
        'opacity': .15
    }, 200);
};

Factful.e.closeCommentsGroup = function(_range){
    Factful.e.openedRange = '';

    var _r = _range,
        _g = Factful.comments.groups[_r._id];

    var _comments = _g.items;

    _g.view_.removeClass('opened');
    _g.view_.addClass('closed');

    var _pass;
    for(var i=0; i<_comments.length; i++){
        var _comment = _comments[i];
        var _cIndex = i;
        $(_comment.buttonView_).slideUp(50, function(){
            if(!$(_comment.view_).hasClass('factful-range-info')){
                if(_cIndex != _pass){
                    if($(_comment.view_).hasClass('factful-factcheck-req') || $(_comment.view_).hasClass('factful-factcheck-score')){
                        _pass = _cIndex + 1;
                    }else{
                        if(_cIndex > 0){
                            $(_comment.contentView_).css('height', '20px');
                            var _before = $(_comment.view_).height() + 26;
                            $(_comment.view_).stop().animate({
                                'margin-top': -_before
                            }, 200);
                        }
                    }
                }
            }
        });
    }
    $('.factful-comments-group.closed').stop().animate({
        'opacity': .15
    }, 200);
    console.log('close comments group');
};

Factful.e.foldInfo = function(e){
    var _info = e.data._info;
    if(_info.st == 'open'){
        $(_info.view_).css('overflow', 'hidden');
        $(_info.view_).animate({
            'height': 72
        }, 500, function(){
            $(_info.foldBtn_).removeClass('to-close').addClass('to-open');
            $(_info.view_).addClass('closed');
            _info.st = 'close';
        });
        // for ranges
        var deltaHeight = _info.oHeight - 76;
        $('.factful-article-range, .factful-article-range-backview, .factful-article-range-menu').animate({
            'top': '-=' + deltaHeight
        }, 500);
    }else{
        $(_info.view_).animate({
            'height': _info.oHeight
        }, 500, function(){
            $(_info.view_).css('overflow', 'visible');
            $(_info.foldBtn_).removeClass('to-open').addClass('to-close');
            $(_info.view_).removeClass('closed');
            _info.st = 'open';
        });
        var deltaHeight = _info.oHeight - 76;
        $('.factful-article-range, .factful-article-range-backview, .factful-article-range-menu').animate({
            'top': '+=' + deltaHeight
        }, 500);
    }

};

Factful.e.inCommentsGroup = function(e){
    var _view = e.data._view;

    $(_view).stop().animate({
        'opacity': .75
    }, 100);
};

Factful.e.outCommentsGroup = function(e){
    var _view = e.data._view;

    $(_view).stop().animate({
        'opacity': .15
    }, 100);
};

