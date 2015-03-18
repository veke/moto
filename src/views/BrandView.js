/*** BrandView.js ***/

define(function(require, exports, module) {
    var View       = require('famous/core/View');
    var Scrollview = require('famous/views/Scrollview');
    var Surface    = require('famous/core/Surface');

    var ModelView = require('views/ModelView');
    var ModelData = require('data/ModelData');

    function BrandView() {
    
        View.apply(this, arguments);
             
        _createBrand.call(this);
         
    }

    BrandView.prototype = Object.create(View.prototype);
    BrandView.prototype.constructor = BrandView;

    BrandView.DEFAULT_OPTIONS = {
    	index: 0,
    	brand: ''
    };
        
    function _createBrand() {
       
	    var brand = this.options.brand;
	    var index = this.options.index;
    
    	this.models = [];
				
		this.scrollView = new Scrollview({
            paginated: 1
        });

        this.scrollView.sequenceFrom(this.models);
            
    	for(var i=0, len = ModelData[this.options.index][brand].length; i<len; i++) {
    
		    this.model = new ModelView({
		        imageUrl: ModelData[index][brand][i].imageUrl,
	            model: ModelData[index][brand][i].name,
	            specs: ModelData[index][brand][i].specs
	        });
	       
	     	this.model.pipe(this.scrollView);
	     	
	        this.models.push(this.model);
	                
	    } /*

        for (var i = 0, temp; i < 40; i++) {
            temp = new Surface({
                 content: "Surface: " + (i + 1),
                 size: [undefined, 200],
                 properties: {
                     backgroundColor: "hsl(" + (i * 360 / 40) + ", 100%, 50%)",
                     lineHeight: "200px",
                     textAlign: "center"
                 }
             });
            temp.pipe(this.scrollView);
            this.models.push(temp);
        }
		 */
		this.scrollView.on('pageChange', function() {
		
			var currentPage = this.scrollView._node.index;
					
			this._eventOutput.emit('modelChange', currentPage);
			
		}.bind(this));
		
    }
    
    module.exports = BrandView;
});
