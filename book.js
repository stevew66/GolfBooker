//
//
// call the packages we need
var express    = require('express');        // call express
var bodyParser = require('body-parser');
var schedule = require('node-schedule');
var PythonShell = require('python-shell');
var mongoose = require('mongoose');
var http = require('http');

//verify script starts with the required parameters
if( process.argv.length != 3 )
{
  console.log('Usage: this script requires a 1 parameters: 1) port to listen on');
  // console.log('node node-server.js 8124 profiledata-nodejs.txt' );
  console.log('node book.js 8124' );
  process.exit(1);
}


//define variables
var app = express();                 // define our app using express
var port = process.argv[2];          // port for running webservice

PythonShell.defaultOptions = { scriptPath: '/Users/steve/Documents/Scripts/Castle_Script/'};


//function for creating scheduled job that calls the python script
//need to use callbacks to return data from a function in node.js
function ScheduleBooking(callback)
{
  console.log( "Function ScheduleBooking" );

  var date = new Date("January 15, 2015 21:55:00");
  var currentdate = new Date();

  console.log('current date', currentdate);
  console.log('scheudled date', date);

  var j = schedule.scheduleJob(date, function(){
      console.log('Booking is Scheduled');

      // send a message in text mode
      //var shell = new PythonShell('script.py', { mode: 'text '});
      //shell.send('hello world!');

//      var PythonShell = require('python-shell');
//      var pyshell = new PythonShell('my_script.py');

      // sends a message to the Python script via stdin
//      pyshell.send('hello');

//      pyshell.on('message', function (message) {
        // received a message sent from the Python script (a simple "print" statement)
//        console.log(message);
//      });

      // end the input stream and allow the process to exit
//      pyshell.end(function (err) {
//        if (err) throw err;
//        console.log('finished');
//      });

      PythonShell.run('HelloWorld.py', function (err, results) {
        if (err) throw err;
        //console.log(results);
        callback(results);
    });
  });
}

//main body of the script and server

console.log('Script started');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('title', "Premium Golf Booker")
app.get('title'); // "My Site"

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

//"connect to DB" at this stage to do the bear stuff!!!

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

//need to get a post working here!!!


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
http.createServer(app).listen(port);

//ScheduleBooking(function(py_return) {
//    console.log(py_return);
//});

console.log('Server running at http://127.0.0.1:' + port);

//j.cancel();
