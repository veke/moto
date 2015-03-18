/* eslint-env browser, amd */

/* PageView.js */

define(function(require, exports, module) {

    'use strict';

    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var ImageSurface = require('famous/surfaces/ImageSurface');
    var ContainerSurface = require('famous/surfaces/ContainerSurface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var HeaderFooter = require('famous/views/HeaderFooterLayout');
    var Lightbox = require('famous/views/Lightbox');
    var Easing = require('famous/transitions/Easing');

    var BrandView = require('views/BrandView');

    function PageView() {

        View.apply(this, arguments);

        _createLayout.call(this);
        _createHeader.call(this);
        _createBody.call(this);

        _setListeners.call(this);

    }

    PageView.prototype = Object.create(View.prototype);
    PageView.prototype.constructor = PageView;

    PageView.DEFAULT_OPTIONS = {
        data: null,
        clientHeight: document.documentElement.clientHeight,
        clientWidth: document.documentElement.clientWidth,
        headerSize: 51,
        lightboxOpts: {
            inOpacity: 0,
            outOpacity: 0,
            inOrigin: [0, 0],
            outOrigin: [0, 0],
            showOrigin: [0, 0],
            inTransform: Transform.translate(0, document.documentElement.clientHeight, 0),
            outTransform: Transform.translate(-document.documentElement.clientWidth, 0, 0),
            inTransition: {
                duration: 580,
                curve: Easing.inOutExpo
            },
            outTransition: {
                duration: 630,
                curve: Easing.inOutExpo
            }
        }
    };

    function _createLayout() {

        this.layout = new HeaderFooter({
            headerSize: this.options.headerSize
        });

        this.add(this.layout);

    }

    function _createHeader() {

        var backgroundSurface = new Surface({
            classes: ['header'],
            properties: {
                zIndex: 1
            }
        });

        this.toggleMenuIconTextContainer = new ContainerSurface({
            size: [true, this.options.headerSize],
            properties: {
                zIndex: 2,
                cursor: 'pointer'
            }
        });

        var iconHamburger = new Surface({
            size: [this.options.headerSize, this.options.headerSize],
            classes: ['iconHamburger']
        });

        var openMenuText = new Surface({
            size: [true, true],
            content: 'Select Brand',
            classes: ['menuText']
        });

        var toggleMenuTextModifier = new StateModifier({
            transform: Transform.translate(50, 0, 0)
        });

        this.toggleMenuIconTextContainer.add(iconHamburger);
        this.toggleMenuIconTextContainer.add(toggleMenuTextModifier).add(openMenuText);

        this.layout.header.add(backgroundSurface);
        this.layout.header.add(this.toggleMenuIconTextContainer);
    }

    function _createBody() {

        var modelData = this.options.data;

        var bodySurface = new ImageSurface({
            size: [undefined, true],
            content: 'src/img/bg.jpg'
        });

        this.bodyBlurSurface = new ImageSurface({
            size: [undefined, true],
            content: 'src/img/bg-blur.jpg'
        });

        this.bodyBlurModifier = new StateModifier({
            opacity: 0
        });

        this.layout.content.add(bodySurface);

        this.layout.content.add(this.bodyBlurModifier).add(this.bodyBlurSurface);

        this.lightBox = new Lightbox(this.options.lightboxOpts);

        this.brands = [];
        this.dots = [];

        for (var i = 0, len = modelData.length; i < len; i++) {

            var brand = new BrandView({
                index: i,
                brand: Object.keys(modelData[i])
            });

            brand.on('modelChange', function(page) {
                this._eventOutput.emit('modelChange', page);
            }.bind(this));

            this.brands.push(brand.scrollView);

            var dotModifiers = [];

            for (var j = 0, top = 20; j < modelData[i][Object.keys(modelData[i])].length; j++, top += 20) {

                var dot = new Surface({
                    size: [10, 10],
                    classes: ['dot'],
                    properties: {
                        background: '#fff',
                        zIndex: 11
                    }
                });

                var dotModifier = new StateModifier({
                    align: [1, 0],
                    transform: Transform.translate(-20, top, 0),
                    opacity: 0
                });

                dotModifiers.push(dotModifier);

                this.layout.content.add(dotModifier).add(dot);

            }

            this.dots.push(dotModifiers);

        }

        var originModifier = new StateModifier({
            align: [0, 1.0],
            origin: [0, 0],
            transform: Transform.translate(-this.options.clientWidth / 2, -this.options.clientHeight / 2, 0)
        });

        this.layout.content.add(originModifier).add(this.lightBox);

    }

    function _setListeners() {

        this.toggleMenuIconTextContainer.on('click', function(e) {
            this._eventOutput.emit('menuToggle', e);
        }.bind(this));

    }

    module.exports = PageView;
});
