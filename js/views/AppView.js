/* eslint-env browser, amd */

/* AppView.js */

define(function(require, exports, module) {

    'use strict';

    var View = require('famous/core/View');
    var Transform = require('famous/core/Transform');
    var Modifier = require('famous/core/Modifier');
    //var FastClick = require('famous/inputs/FastClick');
    var Easing = require('famous/transitions/Easing');
    var Transitionable = require('famous/transitions/Transitionable');
    var GenericSync = require('famous/inputs/GenericSync');
    var MouseSync = require('famous/inputs/MouseSync');
    var TouchSync = require('famous/inputs/TouchSync');
    var _ = require('lodash');

    var PageView = require('views/PageView');
    var MenuView = require('views/MenuView');

    GenericSync.register({
        'mouse': MouseSync,
        'touch': TouchSync
    });

    function AppView() {

        View.apply(this, arguments);

        this.menuToggle = false;
        this.pageViewPos = new Transitionable(0);
        this.currentPage = null;

        this.dragStart = false;

        _createPageView.call(this);
        _createMenuView.call(this);

        _setListeners.call(this);

        //_handleSwipe.call(this);

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
        velThreshold: 0.75,
        data: []
    };

    function _createPageView() {

        this.pageView = new PageView({
            data: this.options.data
        });

        this.pageModifier = new Modifier({
            transform: function() {
                return Transform.translate(this.pageViewPos.get(), 0, 0);
            }.bind(this)
        });

        this.add(this.pageModifier).add(this.pageView);

    }

    function _createMenuView() {

        this.menuView = new MenuView({
            menuData: this.options.data
        });

        this.menuViewModifier = new Modifier({
            transform: function() {
                // Change opacity based on pageView position ratio
                this.menuView.shadowModifier.opacityFrom(1 / this.options.openPosition * this.pageViewPos.get());
                return Transform.translate(this.pageViewPos.get() - this.options.openPosition, 0, 0);
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

    /*
    function _handleSwipe() {

        var sync = new GenericSync(
            ['mouse', 'touch'], {
                direction: GenericSync.DIRECTION_X
            }
        );

        sync.on('start', function(data) {

            console.log('start');

            if (data.clientX < 30) {
                this.dragStart = true;
            }

        }.bind(this));

        sync.on('update', function(data) {

            var currentPosition = this.pageViewPos.get();

            if (this.dragStart && currentPosition <= 240) {
                this.pageViewPos.set(Math.max(0, currentPosition + data.delta));
            }

        }.bind(this));

        sync.on('end', function(data) {

            var velocity = data.velocity;
            var position = this.pageViewPos.get();

            if (position > this.options.posThreshold) {

                if (velocity < -this.options.velThreshold) {
                    this.slideLeft();
                } else {
                    this.slideRight();
                }

            } else {

                if (velocity > this.options.velThreshold) {
                    this.slideRight();
                } else {
                    this.slideLeft();
                }

            }

        }.bind(this));

    }
    */

    function _setDots(array, current) {

        for (var i = 0; i < array.length; i++) {
            array[i].setOpacity(0.5);
        }

        array[current].setOpacity(1);

    }

    function _clearDots() {

        // Clear pagination dots
        for (var i = 0; i < this.pageView.dots.length; i++) {
            for (var j = 0; j < this.pageView.dots[i].length; j++) {
                this.pageView.dots[i][j].setOpacity(0);
            }
        }

        // Clear current menu arrow
        for (var k = 0; k < this.menuView.menuItems.length; k++) {
            this.menuView.menuItems[k].menuCurrentModifier.setOpacity(0, this.options.transition);
        }

    }

    AppView.prototype.toggleView = function(e) {

        var targetSlide = _.indexOf(this.options.data, _.find(this.options.data, e.target.innerText));

        this.slideLeft();

        if (targetSlide >= 0) {

            this.pageView.bodyBlurModifier.setOpacity(0.9, {
                duration: 600,
                curve: Easing.inOutExpo
            });

            if (this.currentPage !== targetSlide) {

                _clearDots.call(this);

                // Clear IntroText
                this.pageView.introTextModifier.setOpacity(0, {
                    duration: 200
                });

                this.pageView.lightBox.show(this.pageView.brands[targetSlide], null, function() {
                    this.pageView.imgModifiers[targetSlide][0].setOpacity(1, {
                        duration: 250
                    });
                }.bind(this));

                this.menuView.menuItems[targetSlide].menuCurrentModifier.setOpacity(1, this.options.transition);

                var currentSlide = this.pageView.brands[targetSlide].getCurrentIndex();

                _setDots(this.pageView.dots[targetSlide], currentSlide ? currentSlide : 0);

            }

            this.currentPage = targetSlide;

        } else {

            _clearDots.call(this);

            this.pageView.lightBox.hide();
            this.pageView.bodyBlurModifier.setOpacity(0);

            this.pageView.introTextModifier.setOpacity(1, {
                duration: 200
            });

            this.currentPage = null;
        }

    };

    AppView.prototype.modelChange = function(page) {

        for (var i = 0; i < this.pageView.dots[this.currentPage].length; i++) {
            this.pageView.dots[this.currentPage][i].setOpacity(0.5);
        }

        this.pageView.dots[this.currentPage][page].setOpacity(1);

    };

    AppView.prototype.toggleMenu = function(e) {

        //if(e.details != null) return false; // Fast click bug (need touch emulation to test on desktop)
        if (this.menuToggle) {
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
            this.dragStart = false;
            this.menuView.resetAnimation();

        }.bind(this));

    };

    module.exports = AppView;

});
