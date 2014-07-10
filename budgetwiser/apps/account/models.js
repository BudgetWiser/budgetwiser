var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// User model schema
var userSchema = new Schema({
    id: {type: String, lowercase: true, trim: true, required: true},
    password: {type: String, required: true},
    profile: {
        username: {type: String, trim: true, required: true},
        email: {type: String, trim: true},
        image: {type: String, trim: true, default: "default_profile_image.png"}
    }
});

// module exports
module.exports = {
    User: mongoose.model('User', userSchema)
};
