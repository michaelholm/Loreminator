// var http = require('http');
// http.createServer(function (req, res) {
//   res.writeHead(200, {'Content-Type': 'text/plain'});
//   res.end('Hello World\n');
// }).listen(3100, '127.0.0.1');
// console.log('Server running at http://127.0.0.1:3100/');


var express = require('express'),
    path = require('path'),
	http = require('http'),
	word = require('./routes/words');
 
var app = express();
 
app.configure(function () {
	app.set('port', process.env.PORT || 3100);
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
	app.use(express.static(path.join(__dirname, 'public')));
});
 
app.get('/words', word.findAll);
app.get('/words/:id', word.findById);
app.post('/words', word.addWord);
app.put('/words/:id', word.updateWord);
app.delete('/words/:id', word.deleteWord);
 
//app.listen(3100);
http.createServer(app).listen(app.get('port'), function () {
    console.log("This is Express server listening on port " + app.get('port'));
});
