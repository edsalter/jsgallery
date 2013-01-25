$(function(){

	var template = function(id) {
		return _.template( $('#' + id).html() );
	};


// 	// Thumbnail Model
// 	var Thumbnail = Backbone.Model.extend({
// 		defaults: {
// 			title: '',
// 			src: '',
// 			current:false
// 		}
// 	});

// 	// A List of thumbnails
// 	var ThumbnailCollection = Backbone.Collection.extend({
// 		model: Thumbnail
// 	});


// 	// View for all thumbnails
// 	var MultiThumbnailView = Backbone.View.extend({
// 		tagName: 'ul',

// 		render: function() {
// 			this.collection.each(function(thumbnail) {
// 				var thumbnailView = new ThumbnailView({ model: thumbnail });
// 				this.$el.append(thumbnailView.render().el);
// 			}, this);

// 			return this;
// 		}
// 	});


// 	// The View for a Thumbnail
// 	var ThumbnailView = Backbone.View.extend({
// 		tagName: 'li',

// 		template: template('thumbnailTemplate'),

// 		render: function() {
// 			this.$el.html( this.template(this.model.toJSON()) );
// 			return this;
// 		}
// 	});

// 	var thumbnailCollection = new ThumbnailCollection([
// 		{
// 			title: 'Diamond',
// 			src: 'file:///Library/Application%20Support/Apple/iChat%20Icons/Gems/Diamond%20Heart.gif',
// 		},
// 		{
// 			title: 'Ruby',
// 			src: 'file:///Library/Application%20Support/Apple/iChat%20Icons/Gems/Ruby%20Heart.gif',
// 		}
// 	]);

// 	//var thumbnailView = new MultiThumbnailView({ collection: thumbnailCollection });
// 	//$(document.body).append(thumbnailView.render().el);







	/***************
	large image
	***************/

	/***************
	* MODEL
	***************/
	var LargeImage = Backbone.Model.extend({
		defaults:{
			title:'Ruby',
			active:false,
			src:'file:///Library/Application%20Support/Apple/iChat%20Icons/Gems/Diamond%20Heart.gif',
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
			//this.$el.html( this.template(this.model.toJSON()) );
			console.log("render model view");
			console.log(this);
			console.log(this.$el.html(this.template(this.model.toJSON())));
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
	


	/***************
	* APP VIEW
	***************/

	var AppView = Backbone.View.extend({
		defaults: {
			showInfo: false
		},

		el: $("#galleryApp"),

		events: {
			"click #add": "createOnEnter",
			"click #destroyAll": "destroyAll"
		},

		initialize: function(){
			this.listenTo(Images, 'add', this.addOne);
			this.listenTo(Images, 'reset', this.addAll);
			this.listenTo(Images, 'all', this.render);

			Images.fetch();
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
					this.addOne();
					break;
				//left
				case 37:					
					imageCollection.previous();
					break;
			}
		},

		addOne: function(todo) {
			console.log('added');
			var view = new LargeImageView({model: todo});
			this.$("#images").append(view.render().el);
		},

		addAll: function() {
			Images.each(this.addOne, this);
		},

		createOnEnter:function(e){
			Images.create({});
		},

		destroyAll: function() {
	    	_.invoke(Images.toArray(), 'destroy');
	      return false;
	    },

		render: function(){
			//console.log("render");
		},

		consoleThis:function(){
			console.log(this);
		}
	});

	var App = new AppView;








	// /***************
	// * COLLECTION VIEW
	// ***************/
	// var CollectionLargeImageView = Backbone.View.extend({
	// 	tagName: 'div',
	// 	position:0,
	// 	active:false,
	// 	model: LargeImage,

	// 	render: function() {
	// 		var largeImageView = new LargeImageView({ 
	// 			model: this.collection.models[this.position]
	// 		});

	// 		this.$el.append(largeImageView.render().el);

	// 		return this;
	// 	},

	// 	events: {
	// 		"click img": "next"
	// 	},

	// 	next: function(){
	// 		if(!this.isLast(this.position)){
	// 			//this.position++;
	// 			this.render();
	// 		}
	// 		else{
	// 			//this.position=0;
	// 			console.log(this.collection.models[0]);
	// 			//this.collection.models[0].attributes.active = true;
	// 		}
			

	// 	},

	// 	isLast:function(position){
	// 		return position == this.collection.length - 1;
	// 	},

	// 	isFirst: function(position){
	// 		return position == 0
	// 	}

	// });

	// var imageCollection = new LargeImageCollection([
	// 	{
	// 		externalOrder: 0,
	// 		title: 'Diamond',
	// 		src: 'file:///Library/Application%20Support/Apple/iChat%20Icons/Gems/Diamond%20Heart.gif',
	// 	},
	// 	{
	// 		externalOrder: 1,
	// 		title: 'Ruby',
	// 		src: 'file:///Library/Application%20Support/Apple/iChat%20Icons/Gems/Ruby%20Heart.gif',
	// 	}
	// ]);	


	// var multiLargeImageView = new CollectionLargeImageView({ collection: imageCollection});
/*
	//to enable sorting
	multiLargeImageView.comparator = function(image) {
		return image.get("externalOrder");
	};
*/

	
	//$(document.body).append(multiLargeImageView.render().el);





});

