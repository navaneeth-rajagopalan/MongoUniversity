var mongo = require("mongodb").MongoClient,
assert=require('assert'),
express = require('express'),
app = express(),
engines = require('consolidate');

app.engine('html', engines.nunjucks);
app.set('view engine', 'html');
app.set('views', __dirname + '/view');



var name ="navaneeth R";



mongo.connect('mongodb://localhost:27017/video', function(err, db){
	assert.equal(null, err);

	app.get('/', function(req, res){
		db.collection('movieDetails').find({"tomato.meter":100}).toArray(function(err, movies){
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