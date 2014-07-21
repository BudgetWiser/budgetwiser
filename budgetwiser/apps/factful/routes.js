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

function viewArticleList(req, res){
    // index function
    res.send('factful');
}

function addArticleView(req, res){
    res.render('factful/article_add', {
        layout: 'factful/layout',
        user_profile: req.user.profile
    });
}

function addArticle(req, res){
    var data = {
        date: req.param('date'),
        press: req.param('press'),
        title: req.param('title'),
        subtitle: req.param('subtitle'),
        content: req.param('content'),
        url: req.param('url')
    };

    var _article  = new Article({
        user: req.user,
        title: data.title,
        subtitle: data.subtitle,
        content: data.content,
        date: data.date,
        press: data.press,
        url: data.url
    });

    var p_list = parser.paragraph(data.content);

    p_list.map(function(p){
        var _paragraph = new Paragraph({
            type: p.type,
            content: p.content
        });
        _article.paragraphs.push(_paragraph);

        var m_list = parser.findMoney(p);
        if (m_list.length != 0){
            m_list.map(function(m){
                var _range = new Range({
                    start: m.start,
                    end: m.end
                });
                var _rel = new Rel({
                    keyword: m.money,
                    info: m.money + '원입니다.'
                });

                _range.rels.push(_rel);
                _paragraph.ranges.push(_range);

                _range.save(function(err){
                    if (err){
                        console.log('+++++ range save error');
                        return handleError(err);
                    }
                    console.log('range ' + _range._id + ' is saved');
                });
                _rel.save(function(err){
                    if (err){
                        console.log('+++++ rel save error');
                        return handleError(err);
                    }
                    console.log('rel ' + _rel._id + ' is saved');
                });
            });//m_list.map end
        }

        _paragraph.save(function(err){
            if (err){
                console.log('+++++ paragraph save error');
                return handleError(err);
            }
            console.log('paragraph ' + _paragraph._id + ' is saved');
        });
    });//p_list.map end

    _article.save(function(err){
        if (err){
            console.log('+++++ article save error');
            return handleError(err);
        }
        console.log('article ' + _article._id + ' is saved');

        return res.send('200', {article: _article});
    });
}// END : addArticle(req, res)

function viewArticle(req, res){
}// END : viewArticle(req, res)

function getArticle(req, res){
}// END : getArticle(req, res)


// routes initialize
function setup(app){
    app.get('/factful', function(req, res){res.redirect('/factful/article/list')});
    app.get('/factful/article/list', viewArticleList);
    app.get('/factful/article/add', session.isAdmin, addArticleView);
    app.post('/factful/article/add', session.isAdmin, addArticle);
    app.get('/factful/article/:id', viewArticle);
}

module.exports = setup;
