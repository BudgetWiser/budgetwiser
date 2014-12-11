var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose');

// User model schema
var userSchema = new Schema({
    /*profile: {
        nickname: {type: String, trim: true, required: true},
        email: {type: String, trim: true},
        image: {type: String, trim: true, default: "default_profile_image.png"}
    }*/
});

userSchema.plugin(passportLocalMongoose);

var User = mongoose.model('User', userSchema);

// module exports
module.exports = {
    User: User,
    userSchema: userSchema
};
