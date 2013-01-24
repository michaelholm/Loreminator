// unbind view objects when closing them
Backbone.View.prototype.close = function () {
    console.log('Closing view ' + this);
    if (this.beforeClose) {
        this.beforeClose();
    }
    this.remove();
    this.unbind();
};

window.Router = Backbone.Router.extend({

	routes: {
		"words"                  : "home",
		// "words"	: "list",
		"words/page/:page"	: "list",
		"words/add"         : "addWord",
		"words/:id"         : "wordDetails",
		"getWords/:limit"	: "getWords"
	},

	home: function() {
		this.dictionary = new WordDictionary;
		this.dictionary.fetch();
		//this.wordslist = new RecentWordsList( { collection: this.dictionary, view: this } );
		this.recentwords = new RecentWordsList({ collection: this.dictionary });
		this.dictionaryList = new DictionaryList({ collection: this.dictionary });
		this.recentwords.render();
		this.dictionaryList.render();
		console.log(this.dictionary.length);
		
	},

	wordDetails: function (id) {
		this.home();
        var word = new Word({_id: id});
        word.fetch({success: function(){
            $("#content").html(new WordView({model: word}).el);
        }});
	},
	
	list: function(page) {
       var p = page ? parseInt(page, 10) : 1;
       var wordList = new WordDictionary();
       wordList.fetch({success: function(){
			this.recentwords = new RecentWordsList({ collection: this.dictionary });
			this.recentwords.render();
       }});
	},

	getWords: function(limit) {
		// get x number of words from localstorage, and randomly sort them
		
		limit = limit || 40;
		//words = this.collection.find( {$where: "rsorter > " + Math.random() } ).limit( limit );
		var words = this.dictionary.filter(function(word) { return word.get("rsorter") > Math.random() }).sort( function() { return 0.5 - Math.random() } );
		
		//words.sort( function() { return 0.5 - Math.random() } );
		var wordList = new Array();
		var i = 0;
		while (i < limit) {
			wordList.push(words[i]);
			i++;
		}
		this.getSentences(wordList);
		//db.docs.findOne( { key : 2, random : { $lte : rand } } )
		
	},
	
	getSentences: function(wordList) {
		// break the words out into sentences of varying length
		// words per sentence count: 7, 10, 11, 14, 15
		wordCounts = new Array(7, 10, 11, 14, 15);
		var sentences = new Array();
		while (wordList.length > 0) {
			var length = wordList.length;
			var rand = wordCounts[Math.floor(Math.random() * wordCounts.length)];
			if (length < rand) {
				rand = rand - length;
			}
			var ws = '';
			var i = 0;
			while (i <= rand) {
				if (typeof(wordList[i].get('word')) != undefined) {
					ws += " " + wordList[i].get('word');
					wordList.splice(i, 1);					
				} 
				i++;
			}
			sentences.push(ws);
			ws = '';			
		}
		
		return sentences;
		
	},
	
	getParagraphs: function(sentences, limit) {
		// break the sentences out into paragraphs of varying length
		// return formatted paragraph
		
		// number of sentences in paragraph
		// 4, 5, 8, 10, 11
	}
 
});



tpl.loadTemplates(['word-options', 'word-details', 'word-list-item', 'dictionary-list-item'], function () {
    // initialize app vars
	window.Loreminator = {};
	window.Loreminator.HeroView = new Hero();
	window.Loreminator.Router = new Router();
	// start backbone
	Backbone.history.start();
	
	// alert( document.URL );

});


$(".alert .close").unbind();
$(".alert .close").on('click', function(e) { $(this).parent('.alert-error').fadeOut('slow'); });

    







