/*
 * use strict mode
 */
'use strict';

/*
 * itialize the project
 */
var Factful = {};

Factful.initialize = function(_id){
    this.content = $('#content');
    this.leftSide = Factful.createElement('div', {'class': 'content-left'});
    this.rightSide = Factful.createElement('div', {'class': 'content-right'});
    this.commentsView = Factful.createElement('div', {'class': 'content-comment'});
    this.comments = {'view_': this.commentsView, 'groups': {}};

    this.content.append(this.leftSide).append(this.rightSide);
    this.rightSide.appendChild(this.commentsView);

    this.initUser();
    this.initArticle(_id);
    this.registerHandlers();
};

Factful.registerHandlers = function(){
    $(this.rightSide).mouseenter(function(){
        Factful.m.commentScroll = true;
    });
    $(this.rightSide).mouseleave(function(){
        Factful.m.commentScroll = false;
    });
    $(window).bind('mousewheel', function(e){
        if(Factful.m.commentScroll && Factful.e.activeRange_){
            if(e.preventDefault) e.preventDefault();
            e.returnValue = false;
            return false;
        }
    });
    $(this.rightSide).bind('mousewheel', function(e){Factful.e.scroll(e)});
};

Factful.initUser = function(){
    $.ajax({
        url: '/account/init',
        type: 'GET',
        success: function(obj){
            Factful.User = {
                _id: obj._id,
                username: obj.username,
                //nickname: obj.profile.nickname,
                //image: '/static/images/user/' + obj.profile.image,
                //email: obj.profile.email
            };
            console.log(Factful.User);
        },
        error: function(xhr){
            Factful.User = {
                _id: '',
                username: 'anonymous',
                //nickname: 'anonymous',
                image: '/static/images/user/default_profile_image.png'
            };
            console.log(Factful.User);
        }
    });
};

Factful.initArticle = function(_id){
    $.ajax({
        url: '/factful/api',
        type: 'GET',
        data: { _id: _id, type: 'article' },
        success: function(obj){
            console.log(obj);
            Factful.article = new Factful.Article(obj);
            Factful.article.generateView(Factful.leftSide);
            Factful.initBudgetInfo(Factful.article.category);
            Factful.initServiceInfo();
        },
        error: function(xhr){
            throw Error(xhr);
        }
    });
};

Factful.initServiceInfo = function(){
    $.ajax({
        url: '/factful/api',
        type: 'GET',
        data: { type: 'services', services: Factful.article.services },
        success: function(obj){
            console.log(obj);
            Factful.services = new Factful.Services(obj);
            Factful.services.generateView(Factful.rightSide);
            Factful.services.eventHandlers();
        },
        error: function(xhr){
            throw Error(xhr);
        }

    });
};

Factful.initBudgetInfo = function(ctg){
    $.ajax({
        url: '/factful/api',
        type: 'GET',
        data: { type: 'budget', ctg: 'all', budget: ctg[0] },
        success: function(obj){
            var data = {
                'name': ctg[0],
                'ctg_1': obj.ctg_1,
                'ctg_3': obj.ctg_3
            };
            var info = new Factful.Info(data),
                article = Factful.article;

            info.generateView(article.infoView_);
            //Factful.initBudgetInfo2(ctg);
            Factful.initParagraphs(Factful.article._id);
        },
        error: function(xhr){
            throw Error(xhr);
        }
    });
};
Factful.initBudgetInfo2 = function(ctg){
    $.ajax({
        url: '/factful/api',
        type: 'GET',
        data: { type: 'budget', ctg: 'all', budget: ctg[1] },
        success: function(obj){
            var data = {
                'name': ctg[1],
                'ctg_1': obj.ctg_1,
                'ctg_3': obj.ctg_3
            };
            var info = new Factful.Info(data),
                article = Factful.article;

            info.generateView(article.infoView_);
        },
        error: function(xhr){
            throw Error(xhr);
        }
    });
};

Factful.initParagraphs = function(_id){
    $.ajax({
        url: '/factful/api',
        type: 'GET',
        data: { _id: _id, type: 'paragraphs' },
        success: function(objList){
            objList.map(function(obj){
                //Factful.article.generateParagraphView(obj);
                var paragraph = new Factful.Paragraph(obj),
                    article = Factful.article;

                paragraph.generateView(article.paragraphsView_);
                article.paragraphs.push(paragraph);

                Factful.initRanges(paragraph._id);

                //Set Factful.rightSide height
                $(Factful.rightSide).css('height', $(Factful.leftSide).height());
            });
        },
        error: function(xhr){
            throw Error(xhr);
        }
    });
};

Factful.initRanges = function(_id){
    if(typeof(Factful.article.rangesView_) === 'undefined'){
        var _rangesView = Factful.createElement('div');
        _rangesView.addClass('factful-article-ranges');
        Factful.article.view_.appendChild(_rangesView);

        var onDrag = false;
        $(_rangesView).mousedown(function(e){
            $(Factful.leftSide).unbind('mouseup', Factful.e.checkRange);
            $(Factful.leftSide).bind('mouseup', Factful.e.checkRange);
            onDrag = true;
        });
        $(document).mouseup(function(e){
            onDrag = false;
            $(_rangesView).css('z-index', 20);
        });
        $(_rangesView).mousemove(function(e){
            if(!onDrag) return;

            onDrag = false;
            if($(e.target).hasClass('factful-article-ranges')){
                $(_rangesView).css('z-index', 5);
            }
        });

        Factful.article.rangesView_ = _rangesView;

        var _rangesBackView = Factful.createElement('div');
        _rangesBackView.addClass('factful-article-ranges-backview');
        Factful.article.view_.appendChild(_rangesBackView);
        Factful.article.rangesBackView_ = _rangesBackView;
    }

    $.ajax({
        url: '/factful/api',
        type: 'GET',
        data: { _id: _id, type: 'ranges' },
        success: function(objList){
            objList.map(function(obj){
                var range = new Factful.Range(obj),
                    paragraph = Factful.findParagraphById(obj._paragraph);

                range.restoreRange();
                range.generateView(Factful.content.offset());
                range.eventHandlers();
                paragraph.ranges.push(range);

                var commentsView = Factful.createElement('div');
                commentsView.addClass(range._id + ' factful-comments-group closed');
                var range_pos = parseInt($(range.view_[0]).css('top')) - 20;

                $(commentsView).css('top', range_pos);
                Factful.comments.view_.appendChild(commentsView);
                Factful.comments.groups[range._id] = {'view_': commentsView, 'move': 0};

                Factful.initComments(range._id, commentsView);
            });
        },
        error: function(xhr){
            throw Error(xhr);
        }
    });
};

Factful.initComments = function(_id, commentsView){
    $.ajax({
        url: '/factful/api',
        type: 'GET',
        data: { _id: _id, type: 'comments' },
        success: function(objList){
            Factful.comments.groups[_id].items = [];
            objList.forEach(function(obj, i, arr){
                var data = {
                    _id: obj._id,
                    _comment: obj._comment,
                    _user: obj._user,
                    username: obj.username,
                    //nickname: obj.nickname,
                    _range: _id,
                    date: obj.date,
                    content: obj.content,
                    ref: obj.ref,
                    symp: obj.symp,
                    child: obj.child
                };

                var comment = new Factful.Comment(data);
                comment.generateView(commentsView);
                comment.eventHandlers();
                Factful.comments.groups[_id].items.push(comment);

                Factful.initCoComments(comment._id, comment);
            });
            Factful.initRangeInfo(_id, commentsView);
        },
        error: function(xhr){
            throw Error(xhr);
        }
    });
};

Factful.initCoComments = function(_id, comment){
    $.ajax({
        url: '/factful/api',
        type: 'GET',
        data: { _id: _id, type: 'cocomments' },
        success: function(objList){
            objList.forEach(function(obj, i, arr){
                var data = {
                    _id: obj._id,
                    _comment: obj._comment,
                    _user: obj._user,
                    username: obj.username,
                    //nickname: obj.nickname,
                    date: obj.date,
                    content: obj.content,
                    ref: obj.ref,
                    symp: obj.symp
                };

                var cocomment = new Factful.CoComment(data);
                cocomment.generateView(comment.groupsView_);
                cocomment.eventHandlers();
                comment.comments.push(cocomment);
            });
        },
        error: function(xhr){
            throw Error(xhr);
        }
    });
};

Factful.initRangeInfo = function(_id, commentsView){
    $.ajax({
        url: '/factful/api',
        type: 'GET',
        data: { _id: _id, type: 'rels' },
        success: function(objList){
            objList.map(function(obj){
                var data = {
                    _range: _id,
                    money: obj.keyword
                };
                var rangeInfo = new Factful.RangeInfo(data);
                rangeInfo.getRelated(function(){
                    rangeInfo.generateView(commentsView);
                    if(rangeInfo.view_ != null){
                        Factful.comments.groups[_id].items.unshift(rangeInfo);

                        var range = Factful.findRangeById(_id);
                        $(range.view_).addClass('factful-article-range-rel');
                        range.info = rangeInfo;
                    }else{
                        if(Factful.comments.groups[_id].items.length == 0){
                            var range = Factful.findRangeById(_id);
                            $(range.view_).remove();
                        }
                    }
                });
            });
            Factful.initFactcheck(_id, commentsView);
        },
        error: function(xhr){
            throw Error(xhr);
        }
    });
};

Factful.initFactcheck = function(_id, commentsView){
    $.ajax({
        url: '/factful/api',
        type: 'GET',
        data: { _id: _id, type: 'factchecks' },
        success: function(objList){
            if(objList.length > 0){
                var data = {
                    '_range': objList[0]._range,
                    '_userList': [],
                    'fcList': []
                };
                objList.map(function(obj){
                    data._userList.push(obj._user);
                    data.fcList.push({
                        'user': obj._user,
                        'score': obj.score,
                        'ref': obj.ref
                    });
                });

                var factcheck = new Factful.Factcheck(data);
                factcheck.generateView(commentsView);
                Factful.comments.groups[_id].items.unshift(factcheck);
                console.log(Factful.comments.groups[_id].items[0]);
            }else{
                Factful.initFactcheckReq(_id, commentsView);
            }
        },
        error: function(xhr){
            throw Error(xhr);
        }
    });
};

Factful.initFactcheckReq = function(_id, commentsView){
    $.ajax({
        url: '/factful/api',
        type: 'GET',
        data: { _id: _id, type: 'factcheckreq' },
        success: function(objList){
            if(objList.length > 0){
                var fcReq = new Factful.FactcheckReq({
                    _range: _id
                });
                fcReq._userList = [];
                objList.map(function(obj){
                    fcReq._userList.push(obj._user);
                });
                fcReq.generateView(commentsView);
                Factful.comments.groups[_id].items.unshift(fcReq);
            }
        },
        error: function(xhr){
            throw Error(xhr);
        }
    });
}
