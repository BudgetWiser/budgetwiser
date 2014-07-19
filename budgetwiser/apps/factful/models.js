var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId,
    Mixed = Schema.Types.Mixed,
    User = require('../account/models').User;


// Factful schema
var articleSchema = new Schema({
    user: {type: ObjectId, ref: 'User'},
    title: String,
    subtitle: String,
    date: Date,
    url: String,
    press: String,
    paragraphs: [{type: ObjectId, ref: 'Paragraph'}]
});

var paragraphSchema = new Schema({
    type: {type: Number, min: 0, max: 1}, // 0: text, 1: image
    content: String,
    ranges: [{type: ObjectId, ref: 'Range'}]
});

var rangeSchema = new Schema({
    start: Number,
    end: Number,
    comments: [{type: ObjectId, ref: 'Comment'}],
    factchecks: [{type: ObjectId, ref: 'Factcheck'}],
    rels: [{type: ObjectId, ref: 'Rel'}]
});

var commentSchema = new Schema({
    user: {type: ObjectId, ref: 'User'},
    type: {type: Number, min: 0, max: 1}, // 0: question, 1: answer
    content: String,
    ref: String,
    comments: [{type: ObjectId, ref: 'Comment'}]
});

var factcheckSchema = new Schema({
    user: {type: ObjectId, ref: 'User'},
    score: {type: Number, min: 0, max: 5},
    ref: String
});

var relSchema = new Schema({
    keyword: String, // number: money, string: keyword
    info: [Mixed]
});

// DB model initialize
var Article = mongoose.model('Article', articleSchema),
    Paragraph= mongoose.model('Paragraph', paragraphSchema),
    Range= mongoose.model('Range', rangeSchema),
    Comment= mongoose.model('Comment', commentSchema),
    Factcheck= mongoose.model('Factcheck', factcheckSchema),
    Rel = mongoose.model('Rel', relSchema);

module.exports = {
    Article: Article,
    Paragraph: Paragraph,
    Range: Range,
    Comment: Comment,
    Factcheck: Factcheck,
    Rel: Rel
};
