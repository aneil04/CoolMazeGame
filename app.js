var express = require('express');
const path = require('path');

var app = express(); app.get('/', function (req, res) {
    // res.sendFile(path.join(__dirname, '/index.html'))
    res.send("hello")
}); 

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});