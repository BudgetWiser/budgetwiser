var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var fooAccountSchema = new Schema({
    test: String
});

mongoose.model('FooAccount', fooAccountSchema);
