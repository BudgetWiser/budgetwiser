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
    this.comments = {'view_': this.rightSide, 'groups': {}};

    this.content.append(this.leftSide).append(this.rightSide);

    this.initArticle(_id);
    this.registerHandlers();
};

Factful.registerHandlers = function(){
    
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
        },
        error: function(xhr){
            throw Error(xhr);
        }
    });
};

Factful.initBudgetInfo = function(ctg){
    console.log(ctg);
    $.ajax({
        url: '/factful/api',
        type: 'GET',
        data: { type: 'budget', ctg: 'all', budget: ctg },
        success: function(obj){
            var data = {
                'name': ctg,
                'ctg_1': obj.ctg_1,
                'ctg_3': obj.ctg_3
            };
            var info = new Factful.Info(data),
                article = Factful.article;

            info.generateView(article.infoView_);
            Factful.initParagraphs(Factful.article._id);
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

        var dragging = false;
        $(_rangesView).mousedown(function(){
            $(Factful.leftSide).unbind('mouseup', Factful.e.checkRange);
            $(Factful.leftSide).bind('mouseup', Factful.e.checkRange);
            dragging = true;
        }).mousemove(function(){
            if(dragging == false) return;

            $(_rangesView).css('z-index', 5);
        });
        $(document).mouseup(function(){
            dragging = false;
            $(_rangesView).css('z-index', 20);
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
                commentsView.addClass(range._id + ' factful-comments-group');
                Factful.comments.view_.appendChild(commentsView);
                Factful.comments.groups[range._id] = {'view_': commentsView};

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
            objList.map(function(obj){
                var data = {
                    _id: obj._id,
                    _comment: obj._comment,
                    _user: obj._user,
                    _range: _id,
                    date: obj.date,
                    content: obj.date,
                    ref: obj.ref
                };

                var comment = new Factful.Comment(data);
                comment.generateView(commentsView);
            });
            Factful.initRangeInfo(_id, commentsView);
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
                });

                var range = Factful.findRangeById(_id);
                range.info = rangeInfo;
            });
        },
        error: function(xhr){
            throw Error(xhr);
        }
    });
};

