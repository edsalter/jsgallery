$(function(){

	var template = function(id) {
		return _.template( $('#' + id).html() );
	};

	var APP = {};

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
			externalOrder: 0
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
		localStorage: new Backbone.LocalStorage("images-backbone"),
		activeModel: 0,

		getActiveModel: function(){
			return this.activeModel;
		},
		

		toArray: function() {
			//returns an array
			return this.filter(function(todo){ return todo; });
    	}
	});

	
/*
	var ThumbnailImageCollection = ImageCollection.extend({

	});

	var Thumbnails = new ThumbnailImageCollection;

	//console.log(Thumbnails)
*/
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
			console.log('render:'+this.model.id);

			this.$el.html(this.template(this.model.toJSON()));

			if(this.model.get('active')==true ){
				this.$el.removeClass('hide');
				this.$el.addClass('active');
			}else{
				this.$el.removeClass('active');
				this.$el.addClass('hide');
			}

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

		addImage:function(image){
			var view = new LargeImageView({model:image});
		},

		addOne: function(image) {
			var view = new LargeImageView({
				model: image
			});

			//set active only for first image		
			if(this.collection.length == 1){
				var currentImage = this.collection.at(this.collection.activeModel);
				currentImage.save('active',true);
			}
			
			this.$el.find('#images').append(view.render().el);
			console.log(this.$el.find('#images'));
		},

		addAll: function() {
			console.log('add all method'+this.$el);
			console.log(this.collection);
			console.log(this);

			if(this.defaults.preLoad=='all'){
				this.collection.each(this.addOne, this);
			}
			//will have lazy load options here
			
		},

		createImage:function(e){
			this.collection.create({
				title:this.collection.length
			});
		},

		destroyAll: function() {
			_.invoke(this.collection.toArray(), 'destroy');
			this.collection.activeModel=0;						//reset to zero
			return false;
	    },

	    next:function(){
	    	console.log(this.collection.activeModel);

			var currentImage = this.collection.at(this.collection.activeModel);
			currentImage.set('active',false);

			//go to next image
			if(this.collection.activeModel < this.collection.length-1){
				var nextImage = this.collection.at(this.collection.activeModel+1);
				nextImage.toggle();

				this.collection.activeModel++;
			} 
			//reached end so go back to the start
			else {
				var nextImage = this.collection.at(0);
				nextImage.toggle();

				this.collection.activeModel=0;
			}		

			
			APP.trigger('mycustomevent');
	    },

	    previous:function(){
	    	console.log(this.collection.activeModel);

			var currentImage = this.collection.at(this.collection.activeModel);
			currentImage.set('active',false);

			//go to previous image
			if(this.collection.activeModel > 0){
				var nextImage = this.collection.at(this.collection.activeModel-1);
				nextImage.toggle();

				this.collection.activeModel--;
			} 
			//reached start so go to end
			else {
				var nextImage = this.collection.at(this.collection.length-1);
				nextImage.toggle();

				this.collection.activeModel = this.collection.length-1;
			}			
	    },	    

		render: function(){
			console.log('calling render');
		},	    

		test: function(){
			console.log(this.el);
			console.log('custom events triggered');
		}
	});



	/***************
	* LARGE IMAGE VIEW
	***************/

	var ImagesView = AbstractImagesView.extend({
		el: $("#image"),

		events: {
			"click #add": "createImage",
			"click #destroyAll": "destroyAll",
			"keypress": "keyActions",
			"click #next":"next",
			"click #previous":"previous"

		},

		initialize: function(){		
			this.listenTo(this.collection, 'reset', this.addAll);		//on reload of page, add all (and render)		
			this.listenTo(this.collection, 'add', this.addOne);			//adding an image			
			this.listenTo(this.collection, 'all', this.render);			//any other event re-render

			//this.collection.fetch();									//gets content from storage

			this.listenTo(APP, 'mycustomevent', this.test);	
		},

		keyActions: function(e){
			switch(e.keyCode){
				//right
				case 39:					
					console.log('right');
					this.next();
					break;
				//left
				case 37:					
					this.previous();
					break;
			}
		}
	});


	var ThumbnailsView = AbstractImagesView.extend({
		el: $("#image"),

		initialize: function(){		
			this.listenTo(this.collection, 'reset', this.addAll);		//on reload of page, add all (and render)		
			this.listenTo(this.collection, 'add', this.addOne);			//adding an image			
			this.listenTo(this.collection, 'all', this.render);			//any other event re-render

			console.log(this.collection);
		}

	});
	



	var AppView = Backbone.View.extend({
		collection: Images,

		initialize: function(){		
			this.collection.fetch();		//on reload of page, add all (and render)		
			console.log(this.collection);
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

