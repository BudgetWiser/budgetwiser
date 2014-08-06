var express = require('express'),
    session = require('../account/middleware'),
    parser = require('./parser'),
    factfulModels = require('./models');

var Article = factfulModels.Article,
    Paragraph = factfulModels.Paragraph,
    Range = factfulModels.Range,
    Comment = factfulModels.Comment,
    Factcheck = factfulModels.Factcheck,
    FactcheckReq = factfulModels.FactcheckReq,
    Rel = factfulModels.Rel;


// Views
var view = {};

view.articleList = function(req, res){
    // index function
    res.send('factful');
};

view.articleAdd = function(req, res){
    res.render('factful/article_add', {
        layout: 'factful/layout',
        user: req.user.profile
    });
};

view.articleItem = function(req, res){
    var _article_id = req.params.id;

    if (req.user){
        user = req.user;
        user.link = '/account/user/' + user._id;
    }else{
        user = {
            _id: 'is-not-auth',
            link: '/account/login?next=' + req.url,
            profile: {
                nickname: '로그인하기',
                image: 'default_profile_image.png'
            }
        };
    }

    res.render('factful/article_view', {
        layout: 'factful/layout',
        article_id: _article_id,
        user: user
    });
};


// Funcs
var article = {};

article.add = function(req, res){
    var data = {
        date: req.param('date'),
        press: req.param('press'),
        title: req.param('title'),
        subtitle: req.param('subtitle'),
        content: req.param('content'),
        url: req.param('url')
    };

    var _category = parser.categorize(data.content);
    console.log('\nArticle Category : ', _category);

    // save Article
    var _article = new Article({
        _user: req.user,
        title: data.title,
        subtitle: data.subtitle,
        date: data.date,
        url: data.url,
        press: data.press,
        category: _category
    });

    _article.save(function (err){
        if (err) return handleError(err); // error

        console.log('An article object(' + _article._id + ') is saved.');
    });

    // save Paragraph, Range and Rel
    var _paragraph_list = parser.paragraph(data.content);

    _paragraph_list.map(function(p){
        // save Paragraph
        var _paragraph = new Paragraph({
            _article: _article,
            type: p.type,
            content: p.content
        });

        _paragraph.save(function (err){
            if (err) return handleError(err); // error

            console.log('|--- A paragraph object(' + _paragraph._id + ') is saved.');
        });

        // save Range and Rel
        var _range_list = parser.findMoney(p);

        _range_list.map(function(r){
            // save Range
            var _range = new Range({
                _paragraph: _paragraph,
                start: r.start,
                end: r.end
            });

            _range.save(function (err){
                if (err) return handleError(err); // error

                console.log('   |--- A range object(' + _range._id + ') is saved.');
            });

            //save Rel
            var _rel = new Rel({
                _range: _range,
                keyword: r.money,
                info: []
            });

            _rel.save(function (err){
                if (err) return handleError(err); // error

                console.log('      |--- A rel object(' + _rel._id + ') is saved.');
            });
        });// _range_list.map
    });// _paragraph_list.map

    console.log('[ saved completed ]');

    return res.send(200);
};// article.add

article.addRange = function(req, res){
    _paragraph = req.param('_paragraph');
    start = req.param('start');
    end = req.param('end');

    var q = Range.findOne({
        '_paragraph': _paragraph,
        'start': start,
        'end': end
    });

    q.exec(function(err, _r){
        if (err){
            res.send(500);
            return handleError(err);
        }else{
            if(_r){
                res.send(200, {
                    statusCode: 1,
                    range: _r
                });
                return;
            }else{
                var _range = new Range({
                    _paragraph: _paragraph,
                    start: start,
                    end: end
                });

                _range.save(function(err, _saved){
                    if (err){
                        res.send(500);
                        return handleError(err);
                    }else{
                        res.send(200, {
                            statusCode: 0,
                            range: _saved
                        });
                    }
                });
            }
        }
    });
};

article.addComment = function(req, res){
    var _range = req.param('_range');
    var content = req.param('content');

    var _comment = new Comment({
        _user: req.user,
        _range: _range,
        content: content
    });

    _comment.save(function(err, _saved){
        if (err){
            res.send(500);
            return handleError(err);
        }else{
            res.send(200, {
                comment: _saved
            });
        }
    });
};

article.addFactcheck = function(req, res){
    var _range = req.param('_range');
    var score = req.param('score');
    var ref = req.param('ref');

    var _factcheck = new Factcheck({
        _user: req.user,
        _range: _range,
        score: score,
        ref: ref
    });

    _factcheck.save(function(err, _saved){
        if (err){
            res.send(500);
            return handleError(err);
        }else{
            res.send(200, {
                factcheck: _saved
            });
        }
    });
};

article.addFactcheckReq = function(req, res){
    var _range = req.param('_range');

    var q = FactcheckReq.findOne({
        '_user': req.user,
        '_range': _range
    });

    q.exec(function(err, _fr){
        if(err){
            res.send(500);
            return handleError(err);
        }else{
            if(_fr){
                res.send(200, {statusCode: 1});
                return;
            }else{
                var _factcheckReq = new FactcheckReq({
                    _user: req.user,
                    _range: _range
                });
                _factcheckReq.save(function(err){
                    res.send(200, {statusCode: 0});
                    return;
                });
            }
        }
    });
};

// REST API
api = {};

api.type = function(req, res){
    var type = req.query.type;

    switch (type){
        case 'article':
            api.getArticle(req, res);
            break;
        case 'paragraphs':
            api.getParagraphs(req, res);
            break;
        case 'ranges':
            api.getRanges(req, res);
            break;
        case 'factchecks':
            api.getFactchecks(req, res);
            break;
        case 'comments':
            api.getComments(req, res);
            break;
        case 'rels':
            api.getRels(req, res);
            break;
        default:
            res.send('factful restAPI Error: type(' + type + ')  doesn\'t exist');
    }
};

api.getArticle = function(req, res){
    var _article_id = req.query._id;
    console.log(_article_id);
    var obj = Article.findOne({'_id': _article_id});

    obj.exec(function(err, _obj){
        if (err){
            res.send(500, 'getArticle Error');
            return handleError(err); // error
        }

        res.json(200, _obj);
    });
};

api.getParagraphs = function(req, res){
    var _article_id = req.query._id;
    var obj = Paragraph.find({'_article': _article_id});

    obj.exec(function(err, _obj){
        if (err){
            res.send(500, 'getParagraphs Error');
            return handleError(err); // error
        }

        res.json(200, _obj);
    });
};

api.getRanges = function(req, res){
    var _paragraph_id = req.query._id;
    var obj = Range.find({'_paragraph': _paragraph_id});

    obj.exec(function(err, _obj){
        if (err){
            res.send(500, 'getRanges Error');
            return handleError(err); // error
        }

        res.json(200, _obj);
    });
};

api.getFactchecks = function(req, res){
    var _range_id = req.query._id;
    var obj = Factcheck.find({'_range': _range_id});

    obj.exec(function(err, _obj){
        if (err){
            res.send(500, 'getFactchecks Error');
            return handleError(err); // error
        }

        res.json(200, _obj);
    });
};

api.getComments = function(req, res){
    var _range_id = req.query._id;
    var obj = Comment.find({'_range': _range_id});

    obj.exec(function(err, _obj){
        if (err){
            res.send(500, 'getComments Error');
            return handleError(err); // error
        }

        res.json(200, _obj);
    });
};

api.getRels = function(req, res){
    var _range_id = req.query._id;
    var obj = Rel.find({'_range': _range_id});

    obj.exec(function(err, _obj){
        if (err){
            res.send(500, 'getComments Error');
            return handleError(err); // error
        }

        res.json(200, _obj);
    });
};


// routes initialize
function setup(app){
    app.get('/factful', function(req, res){res.redirect('/factful/article/list')});

    // view
    app.get('/factful/article/list', view.articleList);
    app.get('/factful/article/item/:id', view.articleItem);

    // rest
    app.get('/factful/api', api.type);

    // article add
    app.get('/factful/add/article', session.isAdmin, view.articleAdd);
    app.post('/factful/add/article', article.add);
    app.post('/factful/add/range', article.addRange);
    app.post('/factful/add/comment', article.addComment);
    app.post('/factful/add/factcheck', article.addFactcheck);
    app.post('/factful/add/factcheckreq', article.addFactcheckReq);
}

module.exports = setup;
