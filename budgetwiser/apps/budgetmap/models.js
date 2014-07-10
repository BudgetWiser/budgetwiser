var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var fooSchema = new Schema({
    foo: String,
    boo: {
        a: String,
        b: [Number]
    }
});

module.exports = {
    Foo: mongoose.model('Foo', fooSchema)
};
