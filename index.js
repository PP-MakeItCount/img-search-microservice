var express = require("express");
var app = express();
var request = require('request');
var mongo = require("mongodb").MongoClient;
var connectON = "mongodb://localhost:27017/searchhistory";
var path = require("path");


mongo.connect(connectON, function(err,_db){
  
  if (err) console.error(err);
  console.log("data base started running");
  
  var db = _db.collection('historyDB');
  
    app.listen(8080,function(){
      console.log("img-search app started...");
    });

    //go to instructions page
    app.get('/',function(req, res) {
        var file = path.join(__dirname,'index.html');
        res.sendFile(file);
    });


    app.get('/latest/imagesearch', function(req, res) {
    
    var array = [];

    var cursor = db.find().limit(10).sort({
      _id: -1
    });

    cursor.forEach(function(doc) {
      var lastQuery = {

        "term": doc.term,
        "time": doc.time

      };

      
      //push results object to array
      array.push(lastQuery);
      
      //when the loop makes the array have 10 results, send the array to display on browser
      if (array.length === 10) {

        res.send(array);

      }

    });



  });



    app.get('/:query',function(req,res){
    var q =  req.params.query;
    var size = req.query.offset || 5;
    console.log(size + " " + q);
    var url = 'https://www.googleapis.com/customsearch/v1?key=AIzaSyCsjOVHIVj9Ph__qB-RAmXqXAVbDpHHn8s&cx=015911330475564395932:wclevqudfka&searchType=image&q=' + q +"?start="+size;
    var history = {
      "term" : q,
      "time" : new Date().toDateString()
    }
    
    if(q !== "favicon.ico"){
      db.save(history);
    }
    
    //console.log(url);
    //console.log("histouy---> " + history );
    var requestObject = {
      uri: url,
      method: 'GET',
      timeout: 10000
    };

    request(requestObject, function(error, response, body) {

      if (error) {
        throw (error);
      } else {
          
        var array = [];

        //parse the body as JSON 
        var result = JSON.parse(body);
        //only use the items of the body, that is an array of search results objects
        var imageList = result.items;
        //(size > 10) ? 10 : size
        console.log("img array is of size"+imageList.length);
        for (var i = 0; i < size ; i++) {
        //loop through array of search result objects and construct an object of info we want to display. Push each object tp array    

          var image = {

            "url": imageList[i].link,
            "snippet": imageList[i].snippet,
            "thumbnail": imageList[i].image.thumbnailLink,
            "context": imageList[i].displayLink
          };
          array.push(image);
        } 
        console.log("sent array is of size"+array.length);
        res.send(array);
      }
    });
    
});

});

    