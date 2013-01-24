
    //window.app = window.app || { };
	// 
	//     window.app = { };
	// app.controllers = { };
	// app.collections = { };
	// app.models = { };
	// app.views = { };
	
	
	window.Hero = Backbone.View.extend({

		el: '.hero-unit',

		events: {
	      "click a#wordAddBtn": "addWord",
		  "click a#dictionaryAddBtn": "showModal"
	  },

		showModal: function() {
			$('.modal').modal('show');
		},

		addWord: function(e) {
			// TODO: update references to LoreminatorRouter
		  	e.preventDefault();
			var self = this;
			// get word from input field
			addword = $("input#word-add").val();

			// close the alert box
			$(".alert .close").trigger('click');

			if (addword.length > 0 && addword.length < 3 ) {
				// message about short words?
			} else if (addword.length >= 3) {

				// check for dupe
				if (Loreminator.Router.dictionary.where( { word: addword } ).length > 0 ) {
					// alert dupe
					$('.hero-unit .alert-error').fadeIn('slow');
				} else {
					// add to collection
					var addWord = new Word({ word: addword });
					// addWord.save();
					addWord.save(null, {
						success: function(model) {
							console.log('Success! New word created and saved: ' + model.get('word'));
						},
						error: function (model, response) {    
							console.log("Ouch! An error. The new word would not save: " + model.get('word'));
						}
					});
					this.addWordLi(addWord);
					$("input#word-add").val('');	
				}

			}

			return this;
		},

		addWordLi: function (model) {
			//The parameter passed is a reference to the model that was added
			wordView = new RecentWordsListItem( { model: model } );
			//console.log("Word List Child Count: " + this.recentwords.el.childElementCount);
			if (Loreminator.Router.recentwords.el.childElementCount < 20) {
				wordView.render();
			} else {
				var last = $(Loreminator.Router.recentwords.el.lastElementChild);
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
	
	/*
	* 	the list of recently added words
	*/
	window.RecentWordsList = Backbone.View.extend({
	    tagName:'ul',
		el: 'ul.wordsListing',

	    initialize:function (models, options) {
			this.collection.bind("reset", this.render, this);
	    },
	
		events: {
			"click div.close": "close"
		},
		
		close: function(e){
	        //e.preventDefault();
			var item = $(e.currentTarget).parent('li')
	        var id = $(e.currentTarget).parent('li').find('a').data("id");
	        var model = this.collection.get(id);
	        var name = model.get("word");
			this.collection.remove( model );
			$('div#dictionary div:contains(' + name + ')').fadeOut('slow');
			//$(item).fadeOut('slow', 'linear', function(){ $(item).remove(); });
			$(item).animate({ height: 'toggle', opacity: 'toggle' }, 'slow', 'swing', function(){ $(item).remove(); });
		},

	    render:function () {	
	        _.each(this.collection.last(20), function (word) {
				var newest = new RecentWordsListItem({model:word});
	            this.$el.prepend(newest.render().el);
	        }, this);
	        return this;
	    }
	});

	/*
	* 	an item (word) in the list of recently added words
	*/
	window.RecentWordsListItem = Backbone.View.extend({

	    tagName:"li",
	
	
		initialize:function () {
			this.template = _.template(tpl.get('word-list-item'));
			this.model.bind('remove', this.remove);
		},
		
		remove: function () {
			console.log("Called remove event on model");
		    $(this.el).remove();
		},
		
		deleteItem: function () {
	        console.log('deleted');
	        this.model.destroy();
	        this.remove();
     	},
		
	    render:function () {
	        this.$el.html(this.template(this.model.toJSON())).hide().prependTo('div#latestWords ul').slideDown();
	        return this;
	    }

	});
	
	window.DictionaryList = Backbone.View.extend({
		el: 'div#dictionary',
		
		render:function () {	
	        _.each(this.collection.models, function (word) {
	            this.$el.prepend(new DictionaryListItem({model:word}).render().el);
	        }, this);
	        return this;
	    }
	});
	
	
	window.DictionaryListItem = Backbone.View.extend({
		tagname: 'div',
		
		initialize:function () {
			this.template = _.template(tpl.get('dictionary-list-item'));
			//this.model.bind('remove', this.remove);
		},
		
		render:function () {	
	        this.$el.html(this.template(this.model.toJSON()));
	        return this;
	    }
	});
	
	window.ModalView = Backbone.View.extend({

	        events: {
	            'click .close': 'close',
				'click button#addDictionaryBtn': 'addDictionary'
	        },

	        initialize: function() {
	            this.template = _.template($('#modal-template').html());
	        },
	
			addDictionary: function() {
				alert('adding');
			},

	        render: function() {
	            this.$el.html(this.template(this.model.toJSON()));
	            return this;
	        },

	        show: function() {
	            $(document.body).append(this.render().el);                
	        },

	        close: function() {
	            this.remove();
	        }

	    });
	   
		



