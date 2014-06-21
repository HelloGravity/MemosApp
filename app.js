var express = require('express');
var compression = require('compression')
var bodyParser = require('body-parser')
var app = express();

app.use(compression());
app.use(bodyParser());
app.use(express.static(__dirname + '/root', { maxAge: 86400000 /*one day*/ }));

var memos = [];
var lastIndex = 0;

app.post('/memos/update', function(req, res) {
	if(	req.body.ids instanceof Array) {
		return res.json({
			removed:req.body.ids.filter(function (id) {
						return memos.every(function (memo) {
							return memo.id != id;
						});
					}),
			added:  memos.filter(function (memo) {
						return req.body.ids.indexOf(memo.id+'') <= -1;
					})
		});
	} else {
		return res.json({added : memos});
	}
});
app.post('/memo/', function(req, res) {
	if(	(typeof(req.body.title) == "string" || req.body.title instanceof String) && 
		(typeof(req.body.text) == "string"  || req.body.text instanceof String)&& 
		req.body.title.trim().length != 0 &&
		req.body.text.trim().length != 0) {
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
var port = process.env.PORT || 5000;
app.listen(port);