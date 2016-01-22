var mongo = require("mongodb").MongoClient,
assert=require('assert'),
express = require('express'),
app = express(),
engines = require('consolidate');

app.engine('html', engines.nunjucks);
app.set('view engine', 'html');
app.set('views', __dirname + '/view');

app.get('/path', function(req, res){
	res.render('hello', {'name':'Navaneeth R'});
});

mongo.connect('mongodb://localhost:27017/videos', function(err, db){
	assert.equal(null, err);

	app.get('/', function(req, res){
		db.collection('movies').find({}).toArray(function(err, movies){
			res.render('movies', {'movies':movies});
		});
	});

	app.use(function(req, res){
		res.sendStatus(404);
	});

	app.listen(5050, function(){
		console.log('Listening on port %d', this.address().port);
	})
});