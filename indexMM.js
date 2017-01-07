
'use strict';

var express = require("express");
var app = express();
  //use request module for HTTP requests
  var request = require('request');

  app.get("/:query(*)", function(req, res) {

    //store the query parameter as variable q
    var q = req.params.query;

    //save the offset query string as variable start for use in Google CSE API. Start indicates the nr in result to start showing
    var start = req.query.offset;
    
    //variable to hold URL for Google API + parameter + query strings
    var url = "https://api.flickr.com/services/rest/?method=flickr.test.echo&name=elon";
    var api = "AIzaSyAHfWtzDISBKz_VvlZnRwMEC3NQIBoSJ38";
    var cse = "015911330475564395932:silpeyry-_u";
    if (start) {
    //when there is an offset query string, append this to the url for Google CSE RESTful API

      url = 'https://www.googleapis.com/customsearch/v1' + '?key=' + api + '&cx=' + cse + '&searchType=image' + '&q=' + q + '&start=' + start;

    } else {

      url = 'https://www.googleapis.com/customsearch/v1' + '?key=' + process.env.CSE_API_Key + '&cx=' + process.env.CSE_ID + '&searchType=image' + '&q=' + q;

    }

    var requestObject = {
    //construct requestObject to be used in request HTTP GET Request

      uri: url,
      method: 'GET',
      timeout: 10000

    };

    request(requestObject, function(error, response, body) {

      if (error) {

        throw (error);

      } else {
          
        //save date and query in database first  

        var d = new Date();

        var date = d.toJSON();

        var query = {

          "term": q,
          "time": date

        };

       /* var collection = db.collection('imagequeries');

        collection.insert(query, function(err, result) {

          if (err) {

            console.log(err);

          } else {

            console.log('Inserted %d documents into the imagequeries collection. The documents inserted with "_id" are:', result.length, result);

          }


        }); 
*/
       //construct the search results

        //array to hold the search result objects
        var array = [];

        //parse the body as JSON 
        var result = JSON.parse(body);
        console.log(result);
        //only use the items of the body, that is an array of search results objects
       // var imageList = result.items || 1;
/*
        for (var i = 0; i < imageList.length; i++) {
        //loop through array of search result objects and construct an object of info we want to display. Push each object tp array    

          var image = {

            "url": imageList[i].link,
            "snippet": imageList[i].snippet,
            "thumbnail": imageList[i].image.thumbnailLink,
            "context": imageList[i].displayLink

          };

          array.push(image);

        } 
*/
        res.send(result);

      } 


    });     


  }); 

app.listen(8080,function(){
  console.log("This runnig");
})