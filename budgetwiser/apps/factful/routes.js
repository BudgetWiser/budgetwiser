var express = require('express'),
    session = require('../account/middleware'),
    parser = require('./parser'),
    factfulModels = require('./models');

var Article = factfulModels.Article,
    Paragraph = factfulModels.Paragraph,
    Range = factfulModels.Range,
    Comment = factfulModels.Comment,
    Factcheck = factfulModels.Factcheck,
    Rel = factfulModels.Rel;


// Views
var view = {};

view.articleList = function(req, res){
    // index function
    return res.send('factful');
};
view.articleAdd = function(req, res){
    return res.render('factful/article_add', {
        layout: 'factful/layout',
        user_profile: req.user.profile
    });
}
view.articleItem = function(req, res){
    res.send(req.params.id + ' article item');
}


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

    // save Article
    var _article = new Article({
        _user: req.user,
        title: data.title,
        subtitle: data.subtitle,
        date: data.date,
        url: data.url,
        press: data.press
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
    var obj = Article.findOne({'_id': _article_id});

    obj.exec(function(err, _obj){
        if (err){
            res.send(500, 'getArticle Error');
            return handleError(err); // error
        }

        res.send(200, _obj);
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

        res.send(200, _obj);
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

        res.send(200, _obj);
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

        res.send(200, _obj);
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

        res.send(200, _obj);
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

        res.send(200, _obj);
    });
};


// routes initialize
function setup(app){
    app.get('/factful', function(req, res){res.redirect('/factful/article/list')});

    app.get('/factful/article/list', view.articleList);
    app.get('/factful/article/add', session.isAdmin, view.articleAdd);
    app.post('/factful/article/add', article.add);
    app.get('/factful/article/item/:id', view.articleItem);

    // rest api
    app.get('/factful/api', api.type);
}

module.exports = setup;
