$(function(){

	var template = function(id) {
		return _.template( $('#' + id).html() );
	};

	/***************
	large image
	***************/

	/***************
	* MODEL
	***************/
	var LargeImage = Backbone.Model.extend({
		defaults:{
			title:'VYRE',
			active:false,
			src:'http://www.vyre.com/other_files/img/test-vyrelogo.png',
			externalOrder: 0,
			isLoaded:false
		},

		toggle: function() {
			this.save({done: !this.get("active")});
		}		
	});

	/***************
	* COLLECTION
	***************/
	var LargeImageCollection = Backbone.Collection.extend({
		model: LargeImage,
		localStorage: new Backbone.LocalStorage("images-backbone"),

		toArray: function() {
			//returns an array
			return this.filter(function(todo){ return todo; });
    	}
	});

	var Images = new LargeImageCollection;

	/***************
	* MODEL VIEW
	***************/
	var LargeImageView = Backbone.View.extend({
		tagName: 'li',

		attributes: {
			class: 'image',
		},

		template: template('largeImageTemplate'),

		events: {
			"click img": "next",
			"mouseover img": "showInfo"
		},


		initialize: function() {
	    	this.listenTo(this.model, 'change', this.render);	    	
	    	this.listenTo(this.model, 'destroy', this.remove);
	    },

		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},

		showInfo: function(){
			//console.log("show info")
			//show image info if available and turned on
		},

		next:function(){
			console.log("next")
			//this.model.attributes.active = true;
			//this.$el.toggle();
		},

	    test:function(){
	    	console.log('test')
	    }
	});

	var ImagesView = Backbone.View.extend({

	});
	


	/***************
	* APP VIEW
	***************/

	var AppView = Backbone.View.extend({
		defaults: {
			showInfo: false
		},

		el: $("body"),

		events: {
			"click #add": "createImage",
			"click #destroyAll": "destroyAll",
			"keypress": "keyActions"
		},

		initialize: function(){			
			this.listenTo(Images, 'reset', this.addAll);		//on reload of page, add all (and render)		
			this.listenTo(Images, 'add', this.addOne);			//adding an image			
			this.listenTo(Images, 'all', this.render);			//any other event re-render

			Images.fetch();										//gets content from storage
		},

		addImage:function(image){
			var view = new LargeImageView({model:image});
		},


		keyActions: function(e){
			switch(e.keyCode){
				//right
				case 39:					
					//this.addImage();
					console.log('right');
					this.createImage();
					break;
				//left
				case 37:					
					imageCollection.previous();
					break;
			}
		},

		addOne: function(todo) {
			var view = new LargeImageView({
				model: todo
			});

			this.$("#images").append(view.render().el);
		},

		addAll: function() {
			Images.each(this.addOne, this);
		},

		createImage:function(e){
			Images.create({});
		},

		destroyAll: function() {
			_.invoke(Images.toArray(), 'destroy');
			return false;
	    },

		render: function(){
			
		}
	});

	var App = new AppView;

});

