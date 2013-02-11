//define global variable to allow external sources to call events
var APP = {};

$(function(){

	var template = function(id) {
		return _.template( $('#' + id).html() );
	};	

	_.extend(APP, Backbone.Events);

	/***************
	large image
	***************/

	/***************
	* MODEL
	***************/
	var Image = Backbone.Model.extend({
		defaults:{
			title:'VYRE',
			active:false,
			src:'http://www.vyre.com/other_files/img/test-vyrelogo.png',
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
		//localStorage: new Backbone.LocalStorage("images-backbone"),
		url:'js/test.json',
		activeModel: 0,

		getActiveModel: function(){
			return this.activeModel;
		},
		

		toArray: function() {
			//returns an array
			return this.filter(function(image){ return image; });
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
				//this.$el.fadeIn(500);
				this.$el.show( "slide", 
                     { direction: "left"  }, 2000 );
			}else{
				//this.$el.fadeOut(500);
				this.$el.hide( "slide", 
                     { direction: "right"  }, 2000 );
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
			APP.trigger("next");
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
			APP.trigger("changeImage", {"position":this.model.get('position')});
		}
	});	


	var Images = new ImageCollection;


	/***************
	* ABSTRACT IMAGES VIEW
	***************/

	var AbstractImagesView = Backbone.View.extend({
		defaults: {
			showInfo: false,
			preLoad: 'all'
		},

		collection: Images,

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
			var activeState = this.collection.length == 0?true:false;

			var title = this.$el.find("#title").val();
			var url = this.$el.find("#url").val();

			this.collection.create({
				//TODO put title in
				title:this.collection.length + title,
				position:this.collection.length,
				active: activeState,
				src:url
			});
		},

		destroyAll: function() {
			_.invoke(this.collection.toArray(), 'destroy');
			this.collection.activeModel=0;						//reset to zero
			return false;
	    },   

		render: function(){
			//console.log('calling render');
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
			this.listenTo(this.collection, 'change:active', this.updateModels);			//any other event re-render

			this.listenTo(APP, 'changeImage', this.changeImage);
			this.listenTo(APP, 'next', this.next);
			this.listenTo(APP, 'previous', this.previous);
		},


		next:function(){
	    	console.log(this.collection.activeModel);

			this.collection.at(this.collection.activeModel).set('active', false);

			//go to next image
			if(this.collection.activeModel < this.collection.length-1){
				this.collection.at(this.collection.activeModel+1).toggle();
				this.collection.activeModel++;
			} 
			//reached end so go back to the start
			else {
				this.collection.at(0).toggle();
				this.collection.activeModel = 0;
			}		

			console.log(this);
	    },

	    previous:function(){
	    	console.log(this.collection.activeModel);

			this.collection.at(this.collection.activeModel).set('active', false);

			//go to previous image
			if(this.collection.activeModel > 0){
				this.collection.at(this.collection.activeModel-1).toggle();
				this.collection.activeModel--;
			} 
			//reached start so go to end
			else {
				this.collection.at(this.collection.length-1).toggle();
				this.collection.activeModel = this.collection.length-1;
			}			
	    },			

		changeImage: function(e){
			//if(e.position < this.collection.length){
				this.collection.at(this.collection.activeModel).set('active',false);

				this.collection.activeModel = e.position;	//update collection pointer to one passed in

				this.collection.at(this.collection.activeModel).set('active',true);		//update to 		
			//}

		},

		updateModels:function(){
					
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
	



	var AppView = Backbone.View.extend({
		el: $("body"),

		collection: Images,

		events: {
			"keypress": "keyActions"
		},

		initialize: function(){		
			this.collection.fetch();		//on reload of page, add all to collection, event will be picked up by views	
			console.log(this.collection);

		},

		keyActions: function(e){
			switch(e.keyCode){
				//right
				case 39:					
					APP.trigger("next");
					break;
				//left
				case 37:					
					APP.trigger("previous");
					break;
			}
		}


	});

	var imagesViewApp = new ImagesView({
		el: $("#image")
	});

	var thumbnailsViewApp = new ThumbnailsView({
		el: $("#thumbnail")
	});	

	var appView = new AppView;


});




