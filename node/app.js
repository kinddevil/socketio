var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http')
var io = require('socket.io');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

var env = process.env.NODE_ENV || 'development';

if ('development' == env) {
    app.set('port', process.env.PORT || 5000);
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));

app.use('/', routes);
app.use('/users', users);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/public", express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

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

var httpServer = http.createServer(app).listen(app.get('port'), function() {
    console.log("Express server listening on port " + app.get('port'));
});

var wsocket = io(httpServer)

wsocket.on('connection', function (client) { 
    client.emit('this', { will: 'be received by everyone'});
    client.on('private message', function (from, msg) {
      console.log(arguments)
      console.log('I received a private message by ', from, ' saying ', msg);
    });

    client.on('disconnect', function () {
      console.log("user disconnected", arguments)
      client.emit('user disconnected');
    });

    client.emit('news', { hello: 'world' });
    // client.volatile.emit('news', { hello: 'world' });
    client.broadcast.emit('broadcast');
    client.on('my other event', function (data) {
      console.log(data);
    }); 
}); 
