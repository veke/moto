/* eslint-env browser, amd */

/* BrandView.js */

define(function(require, exports, module) {

    'use strict';

    var View = require('famous/core/View');
    var Scrollview = require('famous/views/Scrollview');
    var ContainerSurface = require('famous/surfaces/ContainerSurface');

    var ModelView = require('views/ModelView');

    function BrandView() {

        View.apply(this, arguments);

        _createBrand.call(this);

    }

    BrandView.prototype = Object.create(View.prototype);
    BrandView.prototype.constructor = BrandView;

    BrandView.DEFAULT_OPTIONS = {
        index: 0,
        brand: '',
        data: []
    };

    function _createBrand() {

        var brand = this.options.brand;
        var index = this.options.index;
        var len = this.options.data[index][brand].length;
        var container;

        var models = [];

        this.scrollView = new Scrollview({
            paginated: true,
            direction: 0,
            pagePeriod: 400
        });

        this.scrollView.sequenceFrom(models);

        for (var i = 0; i < len; i++) {

            container = new ContainerSurface();

            var model = new ModelView({
                imageUrl: this.options.data[index][brand][i].imageUrl,
                model: this.options.data[index][brand][i].name,
                specs: this.options.data[index][brand][i].specs
            });

            container.add(model);

            model.modelImgSurface.pipe(this.scrollView);
            model.bgSurface.pipe(this.scrollView);
            model.modelTitleSurface.pipe(this.scrollView);

            models.push(container);

        }

        this.scrollView.on('pageChange', function() {

            var currentPage = this.scrollView._node.index;

            this._eventOutput.emit('modelChange', currentPage);

        }.bind(this));

    }

    module.exports = BrandView;

});
