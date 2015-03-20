/* eslint-env browser, amd */

/* MenuView.js */

define(function(require, exports, module) {

    'use strict';

    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Scrollview 	  	 = require('famous/views/Scrollview');
    var ContainerSurface = require('famous/surfaces/ContainerSurface');
    var Transform     	 = require('famous/core/Transform');
    var StateModifier 	 = require('famous/modifiers/StateModifier');
    var Modifier = require('famous/core/Modifier');
    var Easing = require('famous/transitions/Easing');

    var MenuItemView = require('views/MenuItemView');

    function MenuView() {

        View.apply(this, arguments);

        _createLayout.call(this);

        _createBackground.call(this);
        _createHeader.call(this);

        _createMenuItems.call(this);

        _setListeners.call(this);

    }

    MenuView.prototype = Object.create(View.prototype);
    MenuView.prototype.constructor = MenuView;

    MenuView.DEFAULT_OPTIONS = {
        height: 50,
        width: 240,
        curve: Easing.inOutExpo,
        menuData: []
    };

    function _createLayout() {

        this.container = new ContainerSurface({
            size: [this.options.width, undefined],
            properties: {
                zIndex: 1
            }
        });

        this.add(this.container);
    }

    function _createHeader() {

        var closeBar = new Surface({
            size: [this.options.width - 1, this.options.height + 1],
            classes: ['closeBar'],
            properties: {
                zIndex: 1
            }
        });

        this.toggleMenuIconTextContainer = new ContainerSurface({
            size: [true, this.options.height],
            properties: {
                cursor: 'pointer',
                zIndex: 2
            }
        });

        this.toggleMenuIconTextModifier = new StateModifier({
            transform: Transform.translate(-this.options.width, 0, 0),
            opacity: 0
        });

        var iconClose = new Surface({
            size: [40, this.options.height],
            classes: ['iconCloseMenu']
        });

        this.iconCloseModifier = new StateModifier();

        var closeMenuText = new Surface({
            size: [true, true],
            content: 'Close',
            classes: ['menuText']
        });

        var toggleMenuTextModifier = new StateModifier({
            transform: Transform.translate(40, 0, 0)
        });

        this.toggleMenuIconTextContainer.add(this.iconCloseModifier).add(iconClose);
        this.toggleMenuIconTextContainer.add(toggleMenuTextModifier).add(closeMenuText);

        this.container.add(this.toggleMenuIconTextModifier).add(this.toggleMenuIconTextContainer);
        this.container.add(closeBar);

    }

    function _createBackground() {

        var menuBg = new Surface({
            size: [this.options.width, undefined],
            classes: ['menuBg']
        });

        var menuShadow = new Surface({
            size: [this.options.width, undefined],
            classes: ['menuShadow']
        });

        this.shadowModifier = new Modifier({
            opacity: 0
        });

        this.container.add(this.shadowModifier).add(menuShadow);

        this.container.add(menuBg);

    }

    function _createMenuItems() {

        this.menuItems = [];

        var scrollView = new Scrollview();

        for (var i = 0; i < this.options.menuData.length; i++) {

            var item = new MenuItemView({
                title: Object.keys(this.options.menuData[i])
            });

            this.menuItems.push(item);
            item.pipe(scrollView);
        }

        scrollView.sequenceFrom(this.menuItems);

        this.container.add(new StateModifier({
            transform: Transform.translate(0, 51, 0)
        })).add(scrollView);

    }

    function _setListeners() {

        this.toggleMenuIconTextContainer.on('click', function(e) {
            this._eventOutput.emit('menuToggle', e);
        }.bind(this));

        for (var i = 0, len = this.menuItems.length; i < len; i++) {
            this.menuItems[i].on('click', function(e) {
                this._eventOutput.emit('toggleView', e);
            }.bind(this));
        }

    }

    MenuView.prototype.animateElems = function() {

        this.iconCloseModifier.setTransform(
            Transform.rotateZ(Math.PI), {
                duration: 900, curve: this.options.curve
            }
        );

        this.toggleMenuIconTextModifier.setTransform(
            Transform.translate(0, 0, 0), {
                duration: 400, curve: this.options.curve
            }
        );

        this.toggleMenuIconTextModifier.setOpacity(1, {
            duration: 400
        });

        for (var i = 0, duration = 430; i < this.options.menuData.length; i++, duration += 45) {
            this.menuItems[i].menuItemModifier.setTransform(
                Transform.translate(13, 0, 0), {
                    duration: duration, curve: this.options.curve
                }
            );

            this.menuItems[i].menuItemModifier.setOpacity(1, {
               duration: duration
            });

        }

    };

    MenuView.prototype.resetAnimation = function() {

        this.iconCloseModifier.setTransform(Transform.rotateZ(0));

        this.toggleMenuIconTextModifier.setTransform(Transform.translate(-this.options.width - 1, 0, 0));

        this.toggleMenuIconTextModifier.setOpacity(0);

        // Menuitems
        for (var i = 0; i < this.options.menuData.length; i++) {
            this.menuItems[i].menuItemModifier.setTransform(Transform.translate(-this.options.width - 1, 0, 0));
            this.menuItems[i].menuItemModifier.setOpacity(0);
        }

    };

    module.exports = MenuView;

});
