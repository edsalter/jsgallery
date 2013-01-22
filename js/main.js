//$(function(){

	var template = function(id) {
		return _.template( $('#' + id).html() );
	};


	// Thumbnail Model
	var Thumbnail = Backbone.Model.extend({
		defaults: {
			title: '',
			src: '',
			current:false
		}
	});

	// A List of thumbnails
	var ThumbnailCollection = Backbone.Collection.extend({
		model: Thumbnail
	});


	// View for all thumbnails
	var MultiThumbnailView = Backbone.View.extend({
		tagName: 'ul',

		render: function() {
			this.collection.each(function(thumbnail) {
				var thumbnailView = new ThumbnailView({ model: thumbnail });
				this.$el.append(thumbnailView.render().el);
			}, this);

			return this;
		}
	});


	// The View for a Thumbnail
	var ThumbnailView = Backbone.View.extend({
		tagName: 'li',

		template: template('thumbnailTemplate'),

		render: function() {
			this.$el.html( this.template(this.model.toJSON()) );
			return this;
		}
	});

	var thumbnailCollection = new ThumbnailCollection([
		{
			myid: 1,
			title: 'Diamond',
			src: 'file:///Library/Application%20Support/Apple/iChat%20Icons/Gems/Diamond%20Heart.gif',
		},
		{
			myid:2,
			title: 'Ruby',
			src: 'file:///Library/Application%20Support/Apple/iChat%20Icons/Gems/Ruby%20Heart.gif',
		}
	]);

	var thumbnailView = new MultiThumbnailView({ collection: thumbnailCollection });
	$(document.body).append(thumbnailView.render().el);







	/***************
	large image
	***************/

	/***************
	* MODEL
	***************/
	var LargeImage = Backbone.Model.extend({
		defaults:{
			title:'',
			current:false,
			src:''//,
			//order: LargeImages.nextOrder()
		},

		test:function(){
			console.log("test");
		}
	});

	/***************
	* COLLECTION
	***************/
	var LargeImageCollection = Backbone.Collection.extend({
		model: LargeImage,

		next: function(){
			console.log("next");
		},

		previous: function(){
			console.log("previous");
		}
	});

	var imageCollection = new LargeImageCollection([
		{
			myid: 1,
			title: 'Diamond',
			src: 'file:///Library/Application%20Support/Apple/iChat%20Icons/Gems/Diamond%20Heart.gif',
		},
		{
			myid:2,
			title: 'Ruby',
			src: 'file:///Library/Application%20Support/Apple/iChat%20Icons/Gems/Ruby%20Heart.gif',
		}
	]);	

	//LargeImages = new LargeImageCollection;

	/***************
	* COLLECTION VIEW
	***************/
	var MultiLargeImageView = Backbone.View.extend({
		tagName: 'div',

		render: function() {
			this.collection.each(function(largeImage) {
				var largeImageView = new LargeImageView({ model: largeImage });
				this.$el.append(largeImageView.render().el);
			}, this);

			return this;
		},

		position: function(){
			
		},

		lastImage: function(){

		},

		changeCollection: function(){

		}
	});

	/***************
	* MODEL VIEW
	***************/
	var LargeImageView = Backbone.View.extend({
		tagName: 'span',
		template: template('largeImageTemplate'),

		render: function() {
			this.$el.html( this.template(this.model.toJSON()) );
			return this;
		},

		events: {
			"click img": "next",
			"mouseover img": "showInfo"
		},

		next: function(){
			console.log("next");
		},

		previous: function(){
			console.log("previous");
		},

		showInfo: function(){
			console.log("show info")
			//show image info if available and turned on
		}
	});

	var largeImageView = new MultiLargeImageView({ collection: imageCollection});

	/***************
	* APP VIEW
	***************/

	var AppView = Backbone.View.extend({
		defaults: {
			showInfo: false
		},

		el: $("body"),

		events: {
			"keypress": "keyActions",
		},


		keyActions: function(e){
			switch(e.keyCode){
				case 39:
					//left
					imageCollection.model.next();
					break;
				case 37:
					//right
					imageCollection.previous();
					break;
			}
		},

		initialize: function(){

		},

		render: function(){

		}
	});

	var App = new AppView;

	$(document.body).append(largeImageView.render().el);

//});

