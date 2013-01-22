
    //window.app = window.app || { };
	// 
	//     window.app = { };
	// app.controllers = { };
	// app.collections = { };
	// app.models = { };
	// app.views = { };
	
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
	            this.$el.prepend(new RecentWordsListItem({model:word}).render().el);
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
	   
		



