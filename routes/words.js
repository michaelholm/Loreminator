var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('worddb', server);

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'worddb' database");
        db.collection('words', {safe:true}, function(err, collection) {
            if (err) {
                console.log("The 'words' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving word: ' + id);
    db.collection('words', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findAll = function(req, res) {
    db.collection('words', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.addWord = function(req, res) {
    var word = req.body;
    console.log('Adding word: ' + JSON.stringify(word));
    db.collection('words', function(err, collection) {
        collection.insert(word, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}

exports.updateWord = function(req, res) {
    var id = req.params.id;
    var word = req.body;
    console.log('Updating word: ' + id);
    console.log(JSON.stringify(word));
    db.collection('words', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, word, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating word: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(word);
            }
        });
    });
}

exports.deleteWord = function(req, res) {
    var id = req.params.id;
    console.log('Deleting word: ' + id);
    db.collection('words', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}

/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {

    var words = new Backbone.LocalStorage("WordsCollection");
	db.collection = words;
    // db.collection('words', function(err, collection) {
    //     collection.insert(words, {strict:true}, function(err, result) {});
    // });

};