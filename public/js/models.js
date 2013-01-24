// window.app = { };
// app.controllers = { };
// app.models = { };
// app.views = { };

/*
* a single word
*/
window.Word = Backbone.Model.extend({
	
	url: "/words/:word",
	
	defaults: {
		id: null,
		word: null,
		rsorter: Math.random()
	},

	initialize: function () {
		this.bind("remove", function() {
			this.destroy();
		});
	},
	
	/*
	*  TODO: remove reference to the word in the dictionary
	*   which is better with mongodb?? save word with reference to 
	*   it in dictionary (does this make sense even?),
	*   or add the word to the dictionary, and the same word may 
	*   appear as a unique item in one or more dictionaries
	*/
	// Remove this word and delete its view.
    clear: function() {
      this.destroy();
      this.view.remove();
    }
});


/*
*	a collection of words
*/ 
window.WordDictionary = Backbone.Collection.extend({
	
	model: Word,
	
	//localStorage: new Backbone.LocalStorage("WordsCollection"),
	
	unique: true,
	
	url: '/words',
	
	initialize:function () {
        var self = this;
		// on add new word, save the collection
		this.bind("add", this.save);  
		// on add new word, update the view
		//this.bind("add", model.view.addWordLi);  
    },
	
	// localstorage save
	// save: function() {
	//     localStorage.setItem(this.word, JSON.stringify(this.data));
	// }
	
});

window.modalModel = new Backbone.Model();




/*
*
*	LOG MODEL
*
*/

/*
window.LoremLog = Backbone.Model.extend({
	
	defaults: {
		word_id: null,
		word: null,
		date: null,
		action: null		// add, remove
		user: null
	},
	
	initialize: function() {
	
	},

	
});

window.LoremLogs = Backbone.Collection.extend({

	localStorage: new Backbone.LocalStorage("LoremLogs"),
	
	initialize: function(models, options) {
		this.bind("add", this.save);
	},
	
	save: function() {
	    localStorage.setItem(this.name, JSON.stringify(this.data));
	},
	
});

*/