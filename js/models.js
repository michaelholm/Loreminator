// window.app = { };
// app.controllers = { };
// app.models = { };
// app.views = { };

/*
* a single word
*/
window.Word = Backbone.Model.extend({
	
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
	
	url : function() {
	    // Important! It's got to know where to send its REST calls. 
	    // In this case, POST to '/donuts' and PUT to '/donuts/:id'
	    return this.id ? '/loreminator/' + this.id : '/loreminator'; 
	},
	
	// Remove this word from *localStorage* and delete its view.
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
	
	localStorage: new Backbone.LocalStorage("WordsCollection"),
	
	unique: true,
	
	url: function() {
	        return '/loreminator/';
	},
	
	initialize:function () {
        var self = this;
		// on add new word, save the collection
		this.bind("add", this.save);  
		// on add new word, update the view
		//this.bind("add", model.view.addWordLi);  
    },
	
	save: function() {
	    localStorage.setItem(this.word, JSON.stringify(this.data));
	}
	
});




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