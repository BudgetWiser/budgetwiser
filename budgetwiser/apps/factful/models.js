var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId,
    Mixed = Schema.Types.Mixed,
    User = require('../account/models').User;


// Factful schema
var articleSchema = new Schema({
    _user: {type: ObjectId, ref: 'User'},
    title: String,
    subtitle: String,
    date: Date,
    url: String,
    press: String
});

var paragraphSchema = new Schema({
    _article: {type: ObjectId, ref: 'Article'},
    type: {type: Number, min: 0, max: 1}, // 0: text, 1: image
    content: String
});

var rangeSchema = new Schema({
    _paragraph: {type: ObjectId, ref: 'Paragraph'},
    start: Number,
    end: Number
});

var commentSchema = new Schema({
    _user: {type: ObjectId, ref: 'User'},
    _range: {type: ObjectId, ref: 'Range'},
    _comment: {type: ObjectId, ref: 'Comment'},
    content: String,
    ref: String
});

var factcheckSchema = new Schema({
    _user: {type: ObjectId, ref: 'User'},
    _range: {type: ObjectId, ref: 'Range'},
    score: {type: Number, min: 0, max: 5},
    ref: String
});

var factcheckreqSchema = new Schema({
    _user: {type: ObjectId, ref: 'User'},
    _range: {type: ObjectId, ref: 'Range'}
});

var relSchema = new Schema({
    _range: {type: ObjectId, ref: 'Range'},
    keyword: String, // number: money, string: keyword
    info: [Mixed]
});

var budgetSchema = new Schema({
    _parent: ObjectId,
    year: Number,
    name: String,
    category: {type: Number, min: 0, max: 3},
    money: Number
});


// DB model initialize
var Article = mongoose.model('Article', articleSchema),
    Paragraph= mongoose.model('Paragraph', paragraphSchema),
    Range= mongoose.model('Range', rangeSchema),
    Comment= mongoose.model('Comment', commentSchema),
    Factcheck= mongoose.model('Factcheck', factcheckSchema),
    FactcheckReq = mongoose.model('FactcheckReq', factcheckreqSchema),
    Rel = mongoose.model('Rel', relSchema),
    Budget = mongoose.model('Budget', budgetSchema);

module.exports = {
    Article: Article,
    Paragraph: Paragraph,
    Range: Range,
    Comment: Comment,
    Factcheck: Factcheck,
    FactcheckReq: FactcheckReq,
    Rel: Rel,
    Budget: Budget,
};
