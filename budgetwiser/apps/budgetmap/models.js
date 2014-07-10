var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var levelOneSchema = new Schema({
    code: Number,
    name: String
});

var levelTwoSchema = new Schema({
    code: Number,
    name: String,
    category: ObjectId
});

var levelThreeSchema = new Schema({
    name: String,
    category: ObjectId
});

var budgetDataSchema = new Schema({
    budget: Number,
    year: Number,
    category: ObjectId
});

// Export schemas
module.exports = {
    Level_1: mongoose.model('LevelOne', levelOneSchema),
    Level_2: mongoose.model('LevelTwo', levelTwoSchema),
    Level_3: mongoose.model('LevelThree', levelThreeSchema),
    BudgetData: mongoose.model('Budget_data', budgetDataSchema)
};
