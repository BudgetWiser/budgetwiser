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
    date: String,
    url: String,
    press: String,
    category: [String],
    upload: Date,
    services: [String]
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
    username: String,
    nickname: String,
    date: String,
    content: String,
    ref: String,
    symp: [String],
    child: Number
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
    category: {type: Number, min: 1, max: 4},
    money: Number
});

var serviceSchema = new Schema({
    _parent: String,
    orig_name: String,
    calc_name: [String],
    money: Number,
    ctg1: String,
    ctg2: String,
    ctg3: String,
    part: String,
    sibal: Number
});

var wordSchema = new Schema({
    word: String,
    weight: Number
});


// DB model initialize
var Article = mongoose.model('Article', articleSchema),
    Paragraph= mongoose.model('Paragraph', paragraphSchema),
    Range= mongoose.model('Range', rangeSchema),
    Comment= mongoose.model('Comment', commentSchema),
    Factcheck= mongoose.model('Factcheck', factcheckSchema),
    FactcheckReq = mongoose.model('FactcheckReq', factcheckreqSchema),
    Rel = mongoose.model('Rel', relSchema),
    Budget = mongoose.model('Budget', budgetSchema),
    Service = mongoose.model('Service', serviceSchema),
    Word = mongoose.model('Word', wordSchema);

module.exports = {
    Article: Article,
    Paragraph: Paragraph,
    Range: Range,
    Comment: Comment,
    Factcheck: Factcheck,
    FactcheckReq: FactcheckReq,
    Rel: Rel,
    Budget: Budget,
    Service: Service,
    Word: Word
};
