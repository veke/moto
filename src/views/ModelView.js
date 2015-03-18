/*** ModelView.js ***/

define(function(require, exports, module) {
    var View             = require('famous/core/View');
    var Scrollview 	     = require('famous/views/Scrollview');
    var Surface          = require('famous/core/Surface');
    var ContainerSurface = require('famous/surfaces/ContainerSurface');
    var ImageSurface     = require('famous/surfaces/ImageSurface');
    var Transform        = require('famous/core/Transform');
    var StateModifier    = require('famous/modifiers/StateModifier');

    var mod = new StateModifier({
        origin: [0.5, 1],
        align: [0.5, 0]
    });

    var wrapper = new ContainerSurface({
        size: [document.documentElement.clientWidth-20, document.documentElement.clientHeight]
    });

    function ModelView() {
        View.apply(this, arguments);
                
        _createBackground.call(this);        
        _createImage.call(this);
        _createTable.call(this);

        //this.add(mod).add(wrapper);

    }

    ModelView.prototype = Object.create(View.prototype);
    ModelView.prototype.constructor = ModelView;

    ModelView.DEFAULT_OPTIONS = {
	    model:    '',
	    imageUrl: '',
	    specs:    []
    };
    
    function _createBackground() {
	    
	    var bgSurface = new Surface();
	    
	    bgSurface.pipe(this._eventOutput);
	   
        //wrapper.add(bgSurface);
        //this.add(bgSurface);
	    
    }
    
    function _createImage() {
  
	    var modelImgSurface = new ImageSurface({
		    size: [178, 178],
		    content: this.options.imageUrl,
			classes: ['modelImg']
	    });
	    
	    var modelImgModifier = new StateModifier({
		    align: [0.5, 0],
			origin: [0.5, 0]
			//transform: Transform.translate(0, 51, 0)
	    });
	    	    
	    modelImgSurface.pipe(this._eventOutput);
	   
        //wrapper.add(modelImgModifier).add(modelImgSurface);
	    this.add(modelImgModifier).add(modelImgSurface);
 
    }
    
    function _createTable() {
	    
	    var modelTableSurface = new ContainerSurface({
		    size: [undefined, undefined],
            //size: [document.documentElement.clientWidth-15, document.documentElement.clientHeight-(20-178-51-5-40)],
		    classes: ['tableBg']
	    });
	    
	    var modelTableModifier = new StateModifier({
			align: [0.5, 0],
			origin: [0.5, 0],
			transform: Transform.translate(0, 198, 0)
	    });
	    
	    var modelTitleSurface = new Surface({
	    	size: [undefined, 40],
	    	content: this.options.model,
	    	classes: ['modelTitle', 'menuItem']
	    });
	    
	    var scrollview = new Scrollview({
            paginated: true
        });
		var surfaces = [];
		
		scrollview.sequenceFrom(surfaces);
		
		for(var i=0, len = this.options.specs.length; i<len; i++) {
		
			var key = Object.keys(this.options.specs[i]);
	
			var specElem = new Surface({
		    	size: [undefined, 38],
		    	content: '<span class="first">'+ key +'</span><span class="pull-right">'+ this.options.specs[i][key] +'</span>',
		    	classes: ['specItem', 'menuItem']
		    });
		   
		   specElem.pipe(scrollview);
		   surfaces.push(specElem);

		}
		
		var scrollviewModifier = new StateModifier({
			transform: Transform.translate(0, 40, 0)
	    });
	    	    
	    //modelTableSurface.add(scrollviewModifier).add(scrollview);
	    //modelTableSurface.add(modelTitleSurface);
	    
	    //modelTableSurface.pipe(this._eventOutput);
	    
	   // this.add(modelTableModifier).add(modelTableSurface);

//       this.add(surfaces);

        //wrapper.add(modelTableModifier).add(modelTableSurface);
	    
    } 

    module.exports = ModelView;
});
