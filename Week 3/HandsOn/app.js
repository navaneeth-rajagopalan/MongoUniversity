var express = require('express'),
app = express(),
mongodb = require('mongodb'),
mongoClient = mongodb.MongoClient,
assert = require('assert'),
engines = require('consolidate'),
commandLineArgs = require('command-line-args');

app.engine('html',engines.nunjucks);
app.set('view engine', 'html');
app.set('views',__dirname+'/views');

var options = commandLineOptions(),
query = generateQuery(options);

mongoClient.connect("mongodb://localhost:27017/crunchbase", function(err, db){
    assert.equal(err, null);
    var projection = {"_id":0, "founded_year":1, "name":1, "number_of_employees":1};
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
    var cursor = db.collection("companies").find(query).project(projection);
    cursor.forEach(function(company) {
        //console.log(company.name+" is a "+company.category_code+" company.");
        console.log(company);
    },     
    function(err) {
        assert.equal(err, null);
        console.log("Our query was:" + JSON.stringify(query));
        return db.close();
    }
    );
});

function commandLineOptions(){
    var cli = commandLineArgs([
        {name: "firstYear", alias: "f", type:Number},
        {name: "lastYear", alias: "l", type:Number},
        {name: "employees", alias: "e", type:Number}
    ]);    
    var options = cli.parse();  
    if(!("firstYear" in options && "lastYear" in options)){
        console.log(cli.getUsage({
           title:"Usage",
           description: "The first two options below are required. The rest are optional." 
        }));
        process.exit();
    }  
    return options;   
}

function generateQuery(options){
    var query = {
        "founded_year": {"$gte":options.firstYear, "$lte":options.lastYear}
    };
    if ("employees" in options){
        query.number_of_employees = {"$lte":options.employees};
    }
    console.log(query);
    return query;
}