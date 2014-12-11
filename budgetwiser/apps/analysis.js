var express = require('express'),
    fs = require('fs'),
    mongoose = require('mongoose');
    accountModels = require('./account/models'),
    factfulModels = require('./factful/models');

var sec_a = mongoose.createConnection('mongodb://localhost/budgetwiser_A'),
    sec_b = mongoose.createConnection('mongodb://localhost/budgetwiser_B'),
    sec_c = mongoose.createConnection('mongodb://localhost/budgetwiser_C'),
    sec_d = mongoose.createConnection('mongodb://localhost/budgetwiser_D');

var secs = [sec_a, sec_b, sec_c, sec_d];

var User = accountModels.userSchema;

var Article = factfulModels.articleSchema,
    Paragraph = factfulModels.paragraphSchema,
    Range = factfulModels.rangeSchema,
    Comment = factfulModels.commentSchema,
    Factcheck = factfulModels.factcheckSchema,
    FactcheckReq = factfulModels.factcheckreqSchema;

function modelSettings(){
    secs.map(function(sec){
        sec.model('User', User, 'users');
        sec.model('Article', Article, 'articles');
        sec.model('Paragraph', Paragraph, 'paragraphs');
        sec.model('Range', Range, 'ranges');
        sec.model('Comment', Comment, 'comments');
        sec.model('Factcheck', Factcheck, 'factchecks');
        sec.model('FactcheckReq', FactcheckReq, 'factcheckreqs');
    });

    console.log('[1/6] modelSettings() is completed');
}

function commentAnalysis(){
    var funcComp = 0, funcCompL = secs.length;
    secs.map(function(sec){
        var users = sec.model('User').find({'username': /[A-D][0-1][0-9]/i}).sort('username');
        users.exec(function(err, userList){
            if(err) return handleError(err);

            var commentResult = {}, cocommentResult = {};
            var userComp = 0, userCompL = userList.length;
            userList.map(function(user){
                commentResult[user.username] = [], cocommentResult[user.username] = [];
                var comments = sec.model('Comment').find({'_user': user._id}).sort('_id');
                comments.exec(function(err, commentList){
                    if(err) return handleError(err);

                    commentList.map(function(comment){
                        if(comment._comment){
                            cocommentResult[user.username].push(comment);
                        }else{
                            commentResult[user.username].push(comment);
                        }
                    });

                    userComp += 1;
                    if(userComp == userCompL){
                        fs.writeFile('./data/' + sec.name + '_comment.json', JSON.stringify(commentResult), 'utf8', function(err){
                            if(err) return handleError(err);
                        });
                        fs.writeFile('./data/' + sec.name + '_cocomment.json', JSON.stringify(cocommentResult), 'utf8', function(err){
                            if(err) return handleError(err);
                        });
                        if(funcComp == funcCompL){
                            console.log('[2/6] commentAnalysis() is completed');
                        }else{
                            console.log(funcComp);
                        }
                    }
                });
            });
        });
    });
}

function articleAnalysis(){
    var articleResult = [];
    var secComp = 0, secCompL = secs.length;
    secs.map(function(sec){
        sec.model('Comment').count({}, function(err, c){
            var comp = 0, compL = c;
            console.log(compL);

            var articles = sec.model('Article').find();

            articles.exec(function(err, articleList){
                articleList.map(function(article){
                    var paragraphs = sec.model('Paragraph').find({'_article': article._id});
                    paragraphs.exec(function(err1, paragraphList){
                        paragraphList.map(function(paragraph){
                            var ranges = sec.model('Range').find({'_paragraph': paragraph._id});
                            ranges.exec(function(err2, rangeList){
                                rangeList.map(function(range){
                                    var comments = sec.model('Comment').find({'_range': range._id}).populate('_comment');
                                    comments.exec(function(err3, commentList){
                                        commentList.map(function(comment){
                                            comp += 1;
                                            //console.log(comp, compL, secComp+1);
                                            if(article.title != '서울시, 가락시장 사업에 수십억 예산낭비'){
                                                var result = {
                                                    'session': sec.name,
                                                    'article': article.title,
                                                    'paragraph': paragraph.content,
                                                    'range': paragraph.content.substr(range.start, range.end-range.start),
                                                    'user': comment.username,
                                                    'symp': comment.symp.length
                                                };
                                                if(comment._comment){
                                                    result.comment = comment._comment.content;
                                                    result.cocomment = comment.content;
                                                }else{
                                                    result.comment = comment.content;
                                                    result.cocomment = '';
                                                }
                                                articleResult.push(result);
                                            }
                                            if(comp == compL){
                                                secComp += 1;
                                                if(secComp == secCompL){
                                                    fs.writeFile('./data/articleAnalysis.json', JSON.stringify(articleResult), 'utf8', function(err4){
                                                        if(err4) return handleError(err4);
                                                        console.log('[3/6] articleAnalysis() is completed');
                                                    });
                                                }
                                            }
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
}

function startAnalysis(){
    modelSettings();
    //commentAnalysis();
    articleAnalysis();
}

startAnalysis();
