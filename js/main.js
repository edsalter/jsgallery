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
			isLoaded:false,
			activeClass:'nonActive',

		},

		toggle: function() {
			this.set({active: !this.get("active")});
		}		
	});

	/***************
	* COLLECTION
	***************/
	var LargeImageCollection = Backbone.Collection.extend({
		model: LargeImage,
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
			"keypress": "keyActions",
			"click #next":"next",
			"click #previous":"previous"

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
					console.log('right');
					this.next();
					break;
				//left
				case 37:					
					this.previous();
					break;
			}
		},

		addOne: function(image) {
			var view = new LargeImageView({
				model: image
			});

			//set active only for first image		
			if(Images.length == 1){
				var currentImage = Images.at(Images.activeModel);
				currentImage.save('active',true);
			}
			
			this.$("#images").append(view.render().el);
		},

		addAll: function() {
			console.log(Images);
			Images.each(this.addOne, this);
		},

		createImage:function(e){
			Images.create({
				title:Images.length
			});
		},

		destroyAll: function() {
			_.invoke(Images.toArray(), 'destroy');
			Images.activeModel=0;						//reset to zero
			return false;
	    },

	    next:function(){
	    	console.log(Images.activeModel);

			var currentImage = Images.at(Images.activeModel);
			currentImage.set('active',false);

			//go to next image
			if(Images.activeModel < Images.length-1){
				var nextImage = Images.at(Images.activeModel+1);
				nextImage.toggle();

				Images.activeModel++;
			} 
			//reached end so go back to the start
			else {
				var nextImage = Images.at(0);
				nextImage.toggle();

				Images.activeModel=0;
			}			
	    },

	    previous:function(){
	    	console.log(Images.activeModel);

			var currentImage = Images.at(Images.activeModel);
			currentImage.set('active',false);

			//go to previous image
			if(Images.activeModel > 0){
				var nextImage = Images.at(Images.activeModel-1);
				nextImage.toggle();

				Images.activeModel--;
			} 
			//reached start so go to end
			else {
				var nextImage = Images.at(Images.length-1);
				nextImage.toggle();

				Images.activeModel = Images.length-1;
			}			
	    },	    

		render: function(){
			
		}
	});

	var App = new AppView;

});

