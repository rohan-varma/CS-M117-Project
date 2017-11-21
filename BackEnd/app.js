import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import routes from './routes';

const app = express();
// //Import the mongoose module
// var mongoose = require('mongoose');

// //Set up default mongoose connection
// var mongoDB = 'mongodb://127.0.0.1/';
// mongoose.connect(mongoDB, {
//   useMongoClient: true
// });

// //Get the default connection
// var db = mongoose.connection;

// //Bind connection to error event (to get notification of connection errors)
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// mongoose.connect('mongodb://localhost/test_db', function (err) {
// if (err) throw err;
// });
// Middleware
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Define route to be used to provide the Bluetooth Assassin
// REST API
app.use('/BluA', routes);

// Any other routes result in 404
app.use((req, res, next) => {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use((err, req, res, next) => {
	res.status(err.status || 500);
	res.json({
	    message: err.message,
	    error: err
	});
    });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
	message: err.message,
	error: {}
    });
});

module.exports = app;
