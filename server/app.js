console.log('app.js sourced');

var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});
var pg = require('pg');

var connectionString = 'postgres://localhost:5432/treats';

// port decision
var port = process.env.PORT || 3030;

// spin up server
app.listen(port, function() {
  console.log('listening on ' + port);
});

// set up public folder
app.use(express.static('server/public'));

// base url
app.get('/', function(req, res){
  console.log('base URL hit');
  res.sendFile(path.resolve('server/public/views/index.html'));
}); //end base url

// get all the treats
app.get( '/treats', function( req, res ){
  console.log( 'in get /treats' );
  // connect to database
  pg.connect( connectionString, function( err, client, done ){
    if( err ){
      console.log( err );
    } // end error
    else {
      console.log( 'connected to database');
      // array to hold our results
      var treatArray = [];
      // get all the things from table and hold the query results in a variable
      var queryResults = client.query( 'SELECT * FROM treat' );
      queryResults.on( 'row' , function( row ){
        // push each row into results array
        treatArray.push( row );
      }); // end on row
      queryResults.on( 'end', function(){
        // let the database know we are done
        done();
        // send the results back to client
        res.send( treatArray );
      }); //end done
    } // end no error
  }); // end pg connect
}); // end get all treats

// // get search treats
// app.get( '/treats?q=', function( req, res ){
//   console.log( 'in get /treats?q=' );
//   // connect to database
//   pg.connect( connectionString, function( err, client, done ){
//     if( err ){
//       console.log( err );
//     } // end error
//     else {
//       console.log( 'connected to database');
//       // array to hold our results
//       var treatArray = [];
//       // get search results from table and hold the query results in a variable
//       var queryResults = client.query( 'SELECT * FROM treat WHERE name LIKE '%' || $1 || '%'', [query] );
//       queryResults.on( 'row' , function( row ){
//         // push each row into results array
//         treatArray.push( row );
//       }); // end on row
//       queryResults.on( 'end', function(){
//         // let the database know we are done
//         done();
//         // send the results back to client
//         res.send( treatArray );
//       }); //end done
//     } // end no error
//   }); // end pg connect
// }); // end search treats

// post new treat
app.post( '/treats', urlencodedParser, function( req, res ){
  console.log( 'in post /treats:', req.body );
  pg.connect( connectionString, function( err, client, done ){
    if( err ){
      console.log( err );
    }
    else{
      console.log( 'connected to database' );
      // insert new item to database
      client.query( 'INSERT INTO treat ( name, description, pic ) VALUES ( $1, $2, $3 )', [ req.body.name, req.body.description, req.body.pic] );
    } // end no error
  }); // end pg connect
  // send back something so the client will get to "success"
  res.send( true );
}); // end post treat
