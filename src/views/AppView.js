/*** AppView.js ***/

define(function(require, exports, module) {

    var View          	= require('famous/core/View');
    var Surface      	= require('famous/core/Surface');
    var Transform     	= require('famous/core/Transform');
    var StateModifier 	= require('famous/modifiers/StateModifier');
    var Modifier        = require('famous/core/Modifier');
    
    var FastClick     	= require('famous/inputs/FastClick');
    
    var Easing 		  	= require('famous/transitions/Easing');
    var Transitionable	= require('famous/transitions/Transitionable');
    
    var GenericSync     = require('famous/inputs/GenericSync');
    var MouseSync       = require('famous/inputs/MouseSync');
    var TouchSync       = require('famous/inputs/TouchSync');
    
    GenericSync.register({'mouse': MouseSync, 'touch': TouchSync});
    
	var PageView = require('views/PageView');
	var MenuView = require('views/MenuView');
	var MenuData = require('data/MenuData');
	
    function AppView() {
    	 
        View.apply(this, arguments);
        
        this.menuToggle  = false;
        this.pageViewPos = new Transitionable(0);
        this.currentBrand = null;
        this.currentBrandItem = 0;
        
        this.dragStart = false;
                             
        _createPageView.call(this);
        _createMenuView.call(this);
        
        _setListeners.call(this);
        
        _handleSwipe.call(this);
         
    }

    AppView.prototype = Object.create(View.prototype);
    AppView.prototype.constructor = AppView;

    AppView.DEFAULT_OPTIONS = {
        openPosition: 240,
        transition: {
            duration: 190,
            curve: Easing.inOutExpo
        },
        posThreshold: 138,
        velThreshold: 0.75
    };
    
    function _createPageView() {
    
	    this.pageView = new PageView();
	    
	  	this.pageModifier = new Modifier({
		  	transform: function() {
				return Transform.translate(this.pageViewPos.get(), 0, 0);
            }.bind(this)
	  	});
        	    
	    this.add(this.pageModifier).add(this.pageView);

        this.pageView.lightBox.show(this.pageView.brands[0]);
        //this.add(this.pageView.brands[0])
	  	   	    
    }
    
    function _createMenuView() {
    
        this.menuView = new MenuView({ menuData: MenuData });
        
        this.menuViewModifier = new Modifier({
        
		  	transform: function() {
		  	
		  		// Change opacity based on pageView position ratio
		  		this.menuView.shadowModifier.opacityFrom(1 / this.options.openPosition * this.pageViewPos.get());
		  		
                return Transform.translate(this.pageViewPos.get()-this.options.openPosition, 0, 0);
                
            }.bind(this)
	  	});
	  	  	
        this.add(this.menuViewModifier).add(this.menuView);
        
    }
    
    function _setListeners() {
    
        this.pageView.on('menuToggle', this.toggleMenu.bind(this));
        this.menuView.on('menuToggle', this.toggleMenu.bind(this));
        
        this.menuView.on('toggleView', this.toggleView.bind(this));
        
        this.pageView.on('modelChange', this.modelChange.bind(this));
        
    }
    
    AppView.prototype.modelChange = function(page) {
    	
    	for(var i=0; i<this.pageView.dots[this.currentBrandItem].length; i++) {
			this.pageView.dots[this.currentBrandItem][i].setOpacity(0.5);	    	
		}
		
		//this.pageView.dots[this.currentBrandItem][page].setOpacity(1);

    }

    function _handleSwipe() {
    
        var sync = new GenericSync(
            ['mouse', 'touch'], {
            	direction: GenericSync.DIRECTION_X
            }
        );
        /*
        sync.on('start', function(data) {
        
        	console.log('start');
        
           	if(data.clientX < 30) {	
	        	this.dragStart = true;
        	}
        	
        }.bind(this));

        sync.on('update', function(data) {
        
            var currentPosition = this.pageViewPos.get();
            
            if(this.dragStart && currentPosition<=240) {
	          	this.pageViewPos.set(Math.max(0, currentPosition + data.delta));
	        }
          
        }.bind(this));
        
        sync.on('end', (function(data) {
        
            var velocity = data.velocity;
            var position = this.pageViewPos.get();
           
            if(position > this.options.posThreshold) {
                if(velocity < -this.options.velThreshold) {
                   this.slideLeft();
                } else {
                   this.slideRight();
                }
            } else {
                if(velocity > this.options.velThreshold) {
                    this.slideRight();
                } else {
                    this.slideLeft();
                }
            }
            
        }).bind(this));
        
        */
        
    }
    
    function _setDots(array, current) {
	    
	    for(var i=0; i<array.length; i++) {
			array[i].setOpacity(0.5);
    	}
    	
    	array[current].setOpacity(1);

    }
    
    AppView.prototype.toggleView = function(e) {
    
    	this.pageView.bodyBlurModifier.setOpacity(0.9, { duration: 600, curve: Easing.inOutExpo });
    	
    	var targetItem = e.target.innerText;
    	
    	this.slideLeft();
    	
		if(this.currentBrand !== targetItem) {
		
			// Clear pagination dots
			for(var i=0; i<this.pageView.dots.length; i++) {
			
				for(var j=0; j<this.pageView.dots[i].length; j++) {
				
					this.pageView.dots[i][j].setOpacity(0);	
					
				}
				
			}
		
			for(var i = 0; i<=5; i++) {
	    		this.menuView.menuItems[i].menuCurrentModifier.setOpacity(0, this.options.transition);
			}
		
		    switch(targetItem) {
		    
			    case 'Honda':   
			    
			    	this.currentBrandItem = 0;
			    	this.pageView.lightBox.show(this.pageView.brands[0]);
			    	this.menuView.menuItems[0].menuCurrentModifier.setOpacity(1, this.options.transition);
			    	
			    	break;
			    	
			    case 'Suzuki':
			    
			    	this.currentBrandItem = 1;
			    	this.pageView.lightBox.show(this.pageView.brands[1]);
			    	this.menuView.menuItems[1].menuCurrentModifier.setOpacity(1, this.options.transition);
			    		
			    	break;
			    	
			    case 'Kawasaki':
			    
			    	this.currentBrandItem = 2;
			    	this.menuView.menuItems[2].menuCurrentModifier.setOpacity(1, this.options.transition);
			    	this.pageView.lightBox.show(this.pageView.brands[2]);
			    	
			    	break;
			    	
			    case 'Yamaha':
			    
			    	this.currentBrandItem = 3;
			    	this.menuView.menuItems[3].menuCurrentModifier.setOpacity(1, this.options.transition);
			    	this.pageView.lightBox.show(this.pageView.brands[3]);
			    	
			    	break;
			    	
			    case 'BMV':
			    
			    	this.currentBrandItem = 3;
			    	this.menuView.menuItems[4].menuCurrentModifier.setOpacity(1, this.options.transition);
			    	this.pageView.lightBox.show(this.pageView.brands[4]);
			    	
			    	break;
			    	
			     case 'Ducati':
			     
			     	this.currentBrandItem = 3;
				    this.menuView.menuItems[5].menuCurrentModifier.setOpacity(1, this.options.transition);
			    	this.pageView.lightBox.show(this.pageView.brands[5]);
			    				    	
			    	break;
			    	
			    default:
			    
					this.pageView.lightBox.hide();
					this.pageView.bodyBlurModifier.setOpacity(0);
		    }
		    
		    var currentPage = this.pageView.brands[this.currentBrandItem]._currentIndex;
		    
		    _setDots(this.pageView.dots[this.currentBrandItem], currentPage ? currentPage : 0);
		    		    
		}

	    this.currentBrand = targetItem;
	    
    };
    
    AppView.prototype.toggleMenu = function(e) {

        //if(e.details != null) return false; // Fast click bug (need touch emulation to test on desktop)
	    if(this.menuToggle) {			
            this.slideLeft();
        } else {
            this.slideRight();
        }
        
        this.menuToggle = !this.menuToggle;
    };
    
    AppView.prototype.slideRight = function() {
      
        this.pageViewPos.set(this.options.openPosition, this.options.transition, function() {
            this.menuToggle = true;
        }.bind(this));
        
        this.menuView.animateElems();
            		       
    };
    
    AppView.prototype.slideLeft = function() {
    
        this.pageViewPos.set(0, this.options.transition, function() {
        
            this.menuToggle = false;
            
            this.dragStart = false
            
            this.menuView.resetAnimation();
                       
        }.bind(this));
        
    };
    
    module.exports = AppView;
    
});
