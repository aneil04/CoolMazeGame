var express = require('express');
const path = require('path');

var app = express(); app.get('/', function (req, res) {
    // res.sendFile(path.join(__dirname, '/index.html'))
    res.send("hello")
}); 

app.listen(process.env.PORT || 5500, function () {
    console.log('Example app listening on port 3000!');
});