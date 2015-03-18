/*** ModelView.js ***/

define(function(require, exports, module) {
    var View             = require('famous/core/View');
    var Scrollview 	     = require('famous/views/Scrollview');
    var Surface          = require('famous/core/Surface');
    var ContainerSurface = require('famous/surfaces/ContainerSurface');
    var ImageSurface     = require('famous/surfaces/ImageSurface');
    var Transform        = require('famous/core/Transform');
    var StateModifier    = require('famous/modifiers/StateModifier');

    function ModelView() {

        View.apply(this, arguments);
                
        _createBackground.call(this);        
        _createImage.call(this);
        _createTable.call(this);

    }

    ModelView.prototype = Object.create(View.prototype);
    ModelView.prototype.constructor = ModelView;

    ModelView.DEFAULT_OPTIONS = {
	    model:    '',
	    imageUrl: '',
	    specs:    []
    };
    
    function _createBackground() {
	    
	    this.bgSurface = new Surface();
	    
	    this.bgSurface.pipe(this._eventOutput);
	   
        this.add(this.bgSurface);
	    
    }
    
    function _createImage() {
  
	    this.modelImgSurface = new ImageSurface({
		    size: [178, 178],
		    content: this.options.imageUrl,
			classes: ['modelImg']
	    });
	    
	    var modelImgModifier = new StateModifier({
		    align: [0.5, 0],
			origin: [0.5, 0],
			transform: Transform.translate(0, 35, 0)
	    });
	    	    
	    this.modelImgSurface.pipe(this._eventOutput);
	
	    this.add(modelImgModifier).add(this.modelImgSurface);
 
    }
    
    function _createTable() {
	    
	    var modelTableSurface = new ContainerSurface({
            size: [document.documentElement.clientWidth-20, document.documentElement.clientHeight-220-35],
		    classes: ['tableBg']
	    });
	    
	    var modelTableModifier = new StateModifier({
			align: [0.5, 0],
			origin: [0.5, 0],
			transform: Transform.translate(0, 220, 0)
	    });
	    
	    this.modelTitleSurface = new Surface({
	    	size: [undefined, 42],
	    	content: this.options.model,
	    	classes: ['modelTitle', 'menuItem']
	    });
	    
	    var scrollview = new Scrollview();
		var surfaces = [];
		
		scrollview.sequenceFrom(surfaces);

        var topPadder = new Surface({
            size: [undefined, 42]
        });

        surfaces.push(topPadder);
		
		for(var i=0, len = this.options.specs.length; i<len; i++) {
		
			var key = Object.keys(this.options.specs[i]);
	
			var specElem = new Surface({
		    	size: [undefined, 39],
		    	content: '<span class="first">'+ key +'</span><span class="pull-right">'+ this.options.specs[i][key] +'</span>',
		    	classes: ['specItem', 'menuItem'],
                properties: {
                    backgroundColor: i%2===1 ? 'rgba(0,0,0,.09)' : ''
                }
		    });

		   specElem.pipe(scrollview);

		   surfaces.push(specElem);

		}

        var bottomPadder = new Surface({
            size: [undefined, 39]
        });

        surfaces.push(bottomPadder);
	    	    
	    modelTableSurface.add(scrollview);
	    modelTableSurface.add(this.modelTitleSurface);
	    
	    modelTableSurface.pipe(this._eventOutput);
	    
	    this.add(modelTableModifier).add(modelTableSurface);
	    
    } 

    module.exports = ModelView;
});
