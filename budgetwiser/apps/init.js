var base_path = process.cwd();

var express = require('express'),
    path = require('path'),
    favicon = require('static-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    hoganExpress = require('hogan-express'),
    mongoose = require('mongoose'),
    session = require('express-session'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

var app = express();

/// session setup
app.use(session({
    secret: 'budgetwiser', // should it be hashed?
    resave: true,
    saveUninitialized: true
}));

/// passport setup
app.use(passport.initialize());
app.use(passport.session());

var User = require(path.join(base_path, 'apps/account/models')).User;
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/// view engine setup
app.set('views', path.join(base_path, 'views'));
app.set('view engine', 'html');
app.enable('view cache');
app.engine('html', hoganExpress);

/// static path setup
app.use('/static', express.static(path.join(base_path, 'public')));

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());

/// routes setup
var apps = [
    'apps/account/routes',
    'apps/budgetmap/routes',
    'apps/factful/routes',
    'apps/intro/routes'
];
apps.forEach(function(routePath){
    require(path.join(base_path, routePath))(app);
});

/// models setup
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function(){
    var models = [
        'apps/account/models',
        'apps/budgetmap/models',
        'apps/factful/models'
    ];
    models.forEach(function(modelPath){
        require(path.join(base_path, modelPath));
    });
});

mongoose.connect('mongodb://localhost/budgetwiser_live');

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
