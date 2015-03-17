/*** MenuItemView.js ***/

define(function(require, exports, module) {
    var View          	 = require('famous/core/View');
    var Surface       	 = require('famous/core/Surface');
    var ContainerSurface = require('famous/surfaces/ContainerSurface');
    var Transform     	 = require('famous/core/Transform');
    var StateModifier 	 = require('famous/modifiers/StateModifier');

    function MenuItemView() {
        View.apply(this, arguments);
 
        _createItem.call(this);
        
    }

    MenuItemView.prototype = Object.create(View.prototype);
    MenuItemView.prototype.constructor = MenuItemView;

    MenuItemView.DEFAULT_OPTIONS = {
	    width: 239,
	    height: 49,
	    title: ''
    };
    
    function _createItem() {
    
    	var itemWrapper = new ContainerSurface({
	    	size: [this.options.width, this.options.height],
	    	classes: ['menuItem']
    	});
	    
	    var menuItem = new Surface({
		    size: [this.options.width-13, this.options.height],
		    content: this.options.title,
		    classes: ['menuText']
		});
		
		this.menuItemModifier = new StateModifier({
			transform: Transform.translate(-this.options.width, 0, 0),
			opacity: 0
		});
		
		var menuCurrentSurface = new Surface({
			size: [12, 20],
			classes: ['iconArrowRight']
		});
		
		this.menuCurrentModifier = new StateModifier({
			transform: Transform.translate(-35, 0, 0),
			align: [1,0.33],
			opacity: 0
		});
		
		itemWrapper.add(this.menuItemModifier).add(menuItem);
		itemWrapper.add(this.menuCurrentModifier).add(menuCurrentSurface);
		
		itemWrapper.pipe(this._eventOutput);
			    
	    this.add(itemWrapper);
	    
    }

    module.exports = MenuItemView;
});
