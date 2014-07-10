var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var articleSchema = new Schema({
    user_id: ObjectId,
    title: String,
    subtitle: String,
    date: Date,
    url: String,
    press: String,
    paragraphs: [ObjectId]
});

var paragraphSchema = new Schema({
    content: String,
    ranges: [ObjectId]
});

var rangeSchema = new Schema({
    start: Number,
    end: Number,
    comments: [ObjectId],
    factchecks: [ObjectId]
});

var commentSchema = new Schema({
    user_id: ObjectId,
    type: Number, // 0: question, 1: answer
    content: String,
    ref: String,
    comments: [ObjectId]
});

var factcheckSchema = new Schema({
    user_id: ObjectId,
    score: Number,
    ref: String,
    ref_score: {
        score: Number,
        user_id: ObjectId
    }
});

module.exports = {
    Article: mongoose.model('Article', articleSchema),
    Paragraph: mongoose.model('Paragraph', paragraphSchema),
    Range: mongoose.model('Range', rangeSchema),
    Comment: mongoose.model('Comment', commentSchema),
    Factcheck: mongoose.model('Factcheck', factcheckSchema)
};
