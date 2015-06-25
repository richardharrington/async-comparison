var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');

var DATA_FILE_NAME = 'data.json';

app.use(express.static(path.join(__dirname, 'src')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(3000, function(){
  console.log("Listening on port 3000");
});