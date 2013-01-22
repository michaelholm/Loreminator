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
	"~michaelholm/loreminator": "defaultRoute",
    "~michaelholm/loreminator/api/getWords/:limit": "getWords"
  },

	defaultRoute: function() {
		this.dictionary = new WordDictionary;
		this.dictionary.fetch();
		//this.wordslist = new RecentWordsList( { collection: this.dictionary, view: this } );
		this.recentwords = new RecentWordsList({ collection: this.dictionary });
		this.dictionaryList = new DictionaryList({ collection: this.dictionary });
		this.recentwords.render();
		this.dictionaryList.render();
		console.log(this.dictionary.length);
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

window.LoreminatorApp = Backbone.View.extend({
	
	el: '.hero-unit',
	
	//     initialize: function (options) {
	// 	
	// 	this.dictionary = new WordDictionary;
	// 	this.dictionary.fetch();
	// 	//this.wordslist = new RecentWordsList( { collection: this.dictionary, view: this } );
	// 	this.recentwords = new RecentWordsList({ collection: this.dictionary });
	// 	this.dictionaryList = new DictionaryList({ collection: this.dictionary });
	// 	this.recentwords.render();
	// 	this.dictionaryList.render();
	// },
	
	events: {
      "click a#wordAddBtn": "addWord"
  },

	addWord: function(e) {
	  	e.preventDefault();
		addword = $("input#word-add").val();

		// close the alert box
		$(".alert .close").trigger('click');

		if (addword.length > 0 && addword.length < 3 ) {
			// message about short words?
		} else if (addword.length >= 3) {
			var incoming = $("input#word-add").val();

			// check for dupe
			var dupecheck = this.dictionary.where( { word: incoming } );
			if (dupecheck.length > 0 ) {
				// alert dupe
				$('.hero-unit .alert-error').fadeIn('slow');
			} else {
				// add to collection
				var addWord = new Word({ word: incoming });
				var addedWord = this.dictionary.create( 
					addWord, 
					{ wait: true, success: function(model,response) { console.log('Added to collection: ' + model.get('word')); } } 
				);
				this.addWordLi(addWord);
				$("input#word-add").val('');	
			}

		}

		return this;
	},
	
	addWordLi: function (model) {
		//The parameter passed is a reference to the model that was added
		wordView = new RecentWordsListItem( {model: model} );
		console.log("Word List Child Count: " + this.recentwords.el.childElementCount);
		if (this.recentwords.el.childElementCount < 20) {
			wordView.render();
		} else {
			var last = $(this.recentwords.el.lastElementChild);
			last.remove(); 	
			wordView.render();
		}
	},
	  
	render: function (word) {
	    item = new RecentWordsListItem(word);
		appLog.info(item);
		item.render().$el.prependTo('div#latestWords ul');
	},
	
	
	

});

tpl.loadTemplates(['word-options', 'word-details', 'word-list-item', 'dictionary-list-item'], function () {
    // initialize app vars
	window.LoreminatorView = new LoreminatorApp();
	window.LoreminatorRouter = new Router();
	// start backbone
	Backbone.history.start();
	
	// alert( document.URL );

});


$(".alert .close").unbind();
$(".alert .close").on('click', function(e) { $(this).parent('.alert-error').fadeOut('slow'); });
    







