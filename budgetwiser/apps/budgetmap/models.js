var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var fooBudgetmapSchema = new Schema({
    test: String
});

mongoose.model('FooBudgetmap', fooBudgetmapSchema);
