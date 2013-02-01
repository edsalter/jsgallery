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
		localStorage: new Backbone.LocalStorage("images-backbone"),
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
	* MODEL VIEW
	***************/
	var LargeImageView = Backbone.View.extend({
		tagName: 'li',

		template: template('largeImageTemplate'),

		events: {
			"click img": "changeImage",
			"mouseover img": "showInfo"
		},


		initialize: function() {
	    	this.listenTo(this.model, 'change', this.render);	    	
	    	this.listenTo(this.model, 'destroy', this.remove);
	    },

		render: function() {
			//console.log('render:'+this.model.id);

			this.$el.html(this.template(this.model.toJSON()));

			if(this.model.get('active')==true ){
				this.$el.removeClass('hide').addClass('active');;
			}else{
				this.$el.removeClass('active').addClass('hide');
			}

			return this;
		},

		showInfo: function(){
			//console.log("show info")
			//show image info if available and turned on
		},

		changeImage:function(){
			console.log("call toggle");
			console.log(this);
			this.model.toggle();
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

			//set active only for first image		
			if(this.collection.length == 1){
				var currentImage = this.collection.at(this.collection.activeModel);
				currentImage.save('active',true);
			}
			
			this.$el.find('#images').append(view.render().el);
		},

		addAll: function() {
			if(this.defaults.preLoad=='all'){
				this.collection.each(this.addOne, this);
			}
			//will have lazy load options here
			
		},

		createImage:function(e){
			this.collection.create({
				//TODO put title in
				title:this.collection.length,
				position:this.collection.length
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

			//go to next image
			if(this.collection.activeModel < this.collection.length-1){
				var nextImage = this.collection.at(this.collection.activeModel+1);
				nextImage.toggle();
			} 
			//reached end so go back to the start
			else {
				var nextImage = this.collection.at(0);
				nextImage.toggle();
			}		

			console.log(this);
	    },

	    previous:function(){
	    	console.log(this.collection.activeModel);

			var currentImage = this.collection.at(this.collection.activeModel);

			//go to previous image
			if(this.collection.activeModel > 0){
				var nextImage = this.collection.at(this.collection.activeModel-1);
				nextImage.toggle();
			} 
			//reached start so go to end
			else {
				var nextImage = this.collection.at(this.collection.length-1);
				nextImage.toggle();
			}			
	    },	    

		render: function(){
			//console.log('calling render');
		},	    

		test: function(e, args){

			
			console.log('custom events triggered');
			console.log(APP);
			console.log(e);
			console.log(args);
		}
	});



	/***************
	* LARGE IMAGE VIEW
	***************/

	var ImagesView = AbstractImagesView.extend({
		events: {
			"click #add": "createImage",
			"click #destroyAll": "destroyAll",
			"keypress": "keyActions",
			"click #next":"next",
			"click #previous":"previous",
			"click img":"next"

		},

		initialize: function(){		
			this.listenTo(this.collection, 'reset', this.addAll);		//on reload of page, add all (and render)		
			this.listenTo(this.collection, 'add', this.addOne);			//adding an image			
			this.listenTo(this.collection, 'change:active', this.updateModels);			//any other event re-render

			//this.collection.fetch();									//gets content from storage

			//this.listenTo(APP, 'changeImage', this.test);	
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
		},

		changeImage: function(){
			var currentImage = this.collection.at(this.collection.activeModel);
			currentImage.set('active',false);
			//TODO SET NEW CURRENT POSITION
			//this.collection.activeModel--;
			console.log('changeImage Images view');

			//this.collection.set("activeModel", );
		},

		updateModels:function(){
			console.log('updating model');

			var a = this.collection.where({active: true});
			console.log(a[0]);
			//this.collection.activeModel = a[0].get('position');
		}
	});

	/***************
	* THUMBNAILS VIEW
	***************/

	var ThumbnailsView = AbstractImagesView.extend({

		initialize: function(){		
			this.listenTo(this.collection, 'reset', this.addAll);		//on reload of page, add all (and render)		
			this.listenTo(this.collection, 'add', this.addOne);			//adding an image			
			this.listenTo(this.collection, 'all', this.render);			//any other event re-render
			this.listenTo(this.collection, 'change:active', this.changeImage)
			

			console.log(this.collection);
		},

		changeImage: function(){
			var currentImage = this.collection.at(this.collection.activeModel);
			currentImage.set('active',false);
			console.log('changeImage');

			var a = this.collection.where({active: true});
			console.log(a[0]);

			console.log(this.collection);

			this.collection.activeModel = a[0].get('position');
		}
	});
	



	var AppView = Backbone.View.extend({
		collection: Images,

		initialize: function(){		
			this.collection.fetch();		//on reload of page, add all to collection, event will be picked up by views	
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

