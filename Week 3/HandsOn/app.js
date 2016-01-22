var express = require('express'),
app = express(),
mongodb = require('mongodb'),
mongoClient = mongodb.MongoClient,
assert = require('assert'),
engines = require('consolidate');

app.engine('html',engines.nunjucks);
app.set('view engine', 'html');
app.set('views',__dirname+'/views');


mongoClient.connect("mongodb://localhost:27017/crunchbase", function(err, db){
    assert.equal(err, null);
    var query = {"category_code":"web"};
    // Using arrays
    // db.collection("companies").find(query).toArray(function(err, companies){
    //     assert.equal(err, null);
    //     assert.notEqual(companies.length, 0);
    //     companies.forEach(function(company) {
    //         console.log(company.name+" is a "+company.category_code+" company.");
    //     });
    //     
    //     db.close();
    // });    

    // Using cursor.forEach
    var cursor = db.collection("companies").find(query);
    cursor.forEach(function(company) {
        console.log(company.name+" is a "+company.category_code+" company.");
    }, 
    function(err){
        assert.equal(err, null);
        return db.close();
    });       

});