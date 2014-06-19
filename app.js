var express = require('express');
var compression = require('compression')
var bodyParser = require('body-parser')
var app = express();

app.use(compression());
app.use(bodyParser());
app.use(express.static(__dirname + '/root', { maxAge: 86400000 /*one day*/ }));


var memos = [
	{id : 1,title : 'Remember', text : 'The Milk'},
	{id : 2,title : 'Do not remember', text : 'The Milk'}
];
var lastIndex = 2;
app.get('/memos', function(req, res) {
	res.json(memos);
});
app.post('/memo/', function(req, res) {
	if(req.body.title && req.body.text) {
		memos.push({ 
			title : req.body.title, 
			text : req.body.text, 
			id : ++lastIndex
		});
		res.json({id : lastIndex});
	} else {
		res.statusCode = 400;
		return res.send('Error 400: Post syntax incorrect.');
	}
});
app.delete('/memo/:id', function(req, res) {
	memos = memos.filter(function(item){return item.id != req.params.id});
	res.json(true);
});
app.listen(process.env.PORT || 3000);