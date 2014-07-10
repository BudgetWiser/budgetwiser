var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var fooFactfulSchema = new Schema({
    test: String
});

mongoose.model('FooFactful', fooFactfulSchema);
