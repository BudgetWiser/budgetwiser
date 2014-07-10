var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/budgetwiser');

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function(){
    var fooSchema = new Schema({
    });

    var Foo = mongoose.model('Foo', fooSchema);

    module.exports = {
        Foo: Foo
    };
});
