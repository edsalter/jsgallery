//define global variable to allow external sources to call events
var EVENTBUS = {};



$(function(){

	var template = function(id) {
		return _.template( $('#' + id).html() );
	};	

	_.extend(EVENTBUS, Backbone.Events);

	/***************
	large image
	***************/

	/***************
	* MODEL
	***************/
	var Image = Backbone.Model.extend({
		defaults:{
			title:'My title',
			active:false,
			src:'http://icons.iconarchive.com/icons/pixelpirate/futurama/128/Morbo-icon.png',
			externalOrder: 0,
			position:0
		},

		toggle: function() {
			this.set({active: !this.get("active")});
		}		
	});


	/***************
	* COLLECTION
	***************/
	var ImageCollection = Backbone.Collection.extend({
		model: Image,

		activeModel: 0,

		getActiveModel: function(){
			return this.activeModel;
		},
		

		toArray: function() {
			//returns an array
			return this.filter(function(image){ return image; });
    	}
	});


	var Album = Backbone.Model.extend({
		defaults:{
			activeModel:0
		},

		initialize: function(){
			this.images = new ImageCollection;
			//this.images.url = 'js/test2.json'; //'/js/test'+this.id+'.json';

			this.images.url = 'js/test'+this.id+'.json';

			console.log("init album");
			console.log(this);
			//this.images.on("reset", this.render);

			this.images.fetch();
			console.log("log images album");
			console.log(this);

			this.listenTo(EVENTBUS, 'next', this.next);
			this.listenTo(EVENTBUS, 'previous', this.previous);
			this.listenTo(EVENTBUS, 'changeImage', this.changeImage);
			this.listenTo(EVENTBUS, 'destroy', this.remove);
		},

		next:function(){
			console.log("log images album");
			console.log(this);

	    	console.log("this activeModel"+this.get("activeModel"));

			this.images.at(this.get("activeModel")).toggle();

			//go to next image
			if(this.get("activeModel") < this.images.length-1){
				this.images.at(this.get("activeModel")+1).toggle();
				this.set("activeModel", this.get("activeModel")+1);
				console.log("Agoing to next");
			} 
			//reached end so go back to the start
			else {
				this.images.at(0).toggle();
				this.set("activeModel", 0);
				console.log("Bgoing to first");
			}		

			console.log(this);
	    },


		previous:function(){
	    	console.log("this activeModel"+this.get("activeModel"));

			this.images.at(this.get("activeModel")).toggle();

			//go to next image
			if(this.get("activeModel") > 0){
				this.images.at(this.get("activeModel")-1).toggle();
				this.set("activeModel", this.get("activeModel")-1);
			} 
			//reached end so go back to the start
			else {
				this.images.at(this.images.length-1).toggle();
				this.set("activeModel", this.images.length-1);
			}		
	    },

		changeImage: function(e){
			console.log("changeImage");
			console.log(this.images);
			//if(e.position < this.collection.length){
				this.images.at(this.get("activeModel")).set('active',false);
				
				this.set("activeModel", e.position);	//update collection pointer to one passed in

				this.images.at(this.get("activeModel")).set('active',true);		//update to 		
			//}

		}		


	});	

	
	/***************
	* LARGE INDIVIDUAL VIEW
	***************/
	var LargeImageView = Backbone.View.extend({
		tagName:  "li",

		template: template('largeImageTemplate'),

		events: {
			"click img": "onclick",
			"mouseover img": "mouseover",
			"mouseout img": "mouseout"
		},


		initialize: function() {
	    	this.listenTo(this.model, 'change:active', this.render);	    	
	    	this.listenTo(this.model, 'destroy', this.remove);
	    },

		render: function() {
			//console.log('render:'+this.model.id);

			this.$el.html(this.template(this.model.toJSON()));

			if(this.model.get('active')==true ){
				this.$el.fadeIn(1000);
			}
			else{
				this.$el.fadeOut(1000);
			}

			return this;
		},

		mouseover: function(e){
			this.$el.find("label").toggle();
		},

		mouseout: function(e){
			this.$el.find("label").toggle();
		},

		onclick:function(){
			EVENTBUS.trigger("next");
		}
	});

	/***************
	* THUMBNAIL INDIVIDUAL VIEW
	***************/
	var ThumbnailImageView = Backbone.View.extend({
		tagName:  "li",

		template: template('thumbnailTemplate'),

		events: {
			"click img": "changeImage"
		},


		initialize: function() {
	    	this.listenTo(this.model, 'change:active', this.render);	    	
	    	this.listenTo(this.model, 'destroy', this.remove);
	    },

		render: function() {
			this.$el.html(this.template(this.model.toJSON()));

			if(this.model.get('active')==true ){
				this.$el.addClass('active');;
			}else{
				this.$el.removeClass('active');
			}

			return this;
		},

		//trigger and event and send the id of the item that was clicked
		changeImage:function(){
			EVENTBUS.trigger("changeImage", {"position":this.model.get('position')});
		}
	});	



	/***************
	* ABSTRACT IMAGES COLLECTION VIEW
	***************/

	var AbstractImagesView = Backbone.View.extend({
		defaults: {
			showInfo: false,
			preLoad: 'all'
		},

		initialize: function(){			
							
		},

		addOne: function(image) {
			var view = new LargeImageView({
				model: image
			});

			this.$el.find('#images').append(view.render().el);
		},

		addAll: function() {
			if(this.defaults.preLoad=='all'){
				this.collection.each(this.addOne, this);
			}
			//will have lazy load options here
			
		},

		createImage:function(e){
			//set active only for first image
			//var activeState = this.collection.length == 0?true:false;

			var title = this.$el.find("#title").val();
			var url = this.$el.find("#url").val();

			this.collection.create({
				//TODO put title in
				title:title,
				//position:this.collection.length,
				//active: activeState,
				src:url
			});
		},

		destroyAll: function() {
			_.invoke(this.collection.toArray(), 'destroy');
			//this.collection.activeModel=0;						//reset to zero
			console.log('destroying colleciton');
			return false;
	    },   

		render: function(){
			console.log('calling render');
		}	
	});



	/***************
	* LARGE IMAGE COLLECTION VIEW
	***************/

	var ImagesView = AbstractImagesView.extend({
		

		events: {
			"click #add": "createImage",
			"click #destroyAll": "destroyAll",
			"click #next":"next",
			"click #previous":"previous"
		},

		initialize: function(){		
			this.listenTo(this.collection, 'reset', this.addAll);		//on reload of page, add all (and render)		
			this.listenTo(this.collection, 'add', this.addOne);			//adding an image			

			this.listenTo(EVENTBUS, 'destroyAll', this.destroyAll);
		},		

		updateModels:function(){
					
		},

		next: function(){
			EVENTBUS.trigger("next");
		},

		previous: function(){
			EVENTBUS.trigger("previous");
			console.log('sdf');
		}		

	});

	/***************
	* THUMBNAILS COLLECTION VIEW
	***************/

	var ThumbnailsView = AbstractImagesView.extend({

		initialize: function(){		
			this.listenTo(this.collection, 'reset', this.addAll);		//on reload of page, add all (and render)		
			this.listenTo(this.collection, 'add', this.addOne);			//adding an image			
			this.listenTo(this.collection, 'all', this.render);			//any other event re-render			

			console.log(this.collection);
		},

		addOne: function(image) {
			var view = new ThumbnailImageView({
				model: image
			});

			this.$el.find('#images').append(view.render().el);
		}
	});

	/***************
	* APP VIEW
	***************/

	var App = Backbone.Model.extend({

	});

	var AppView = Backbone.View.extend({
		el: $("body"),

		events: {
			"keypress": "keyActions"
		},

		initialize: function(){		
			//this.collection.fetch();	
			// this.fetch();
			this.listenTo(EVENTBUS, 'fetch', this.fetch);
		},

		fetch: function(e){
			console.log(e);

			// this.collection.url='js/test.json';
			// this.collection.fetch();		//on reload of page, add all to collection, event will be picked up by views	
			// console.log(this.collection);
		},

		keyActions: function(e){
			switch(e.keyCode){
				//right
				case 39:					
					EVENTBUS.trigger("next");
					break;
				//left
				case 37:					
					EVENTBUS.trigger("previous");
					break;
			}
		}


	});

	var album = {};
	var imagesViewApp = {};
	var thumbnailsViewApp = {};


	var AppRouter = Backbone.Router.extend({
		routes: {
			"album/:id"		:"album"	//#album/1
		},

		album: function(id){					
			if (!jQuery.isEmptyObject(album)){
				album.stopListening();
				EVENTBUS.trigger("destroyAll");
			}

			console.log("router");
			console.log(id);

			album = new Album({
				id: id
			});

			
			console.log('album');
			console.log(album);


			imagesViewApp = new ImagesView({
				el: $("#image"),
				collection: album.images
			});

			thumbnailsViewApp = new ThumbnailsView({
				el: $("#thumbnail"),
				collection: album.images
			});	
		}
	});

	appRouter = new AppRouter;
	Backbone.history.start();



	var appView = new AppView;


});




