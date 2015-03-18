/* eslint-env browser */
/* globals define */

/*** BrandView.js ***/

define(function(require, exports, module) {

    'use strict';

    var View = require('famous/core/View');
    var Scrollview = require('famous/views/Scrollview');
    var ContainerSurface = require('famous/surfaces/ContainerSurface');

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
        var len = ModelData[index][brand].length;
        var container;

        var models = [];

        this.scrollView = new Scrollview({
            paginated: true
        });

        this.scrollView.sequenceFrom(models);

        for (var i = 0; i < len; i++) {

            container = new ContainerSurface();

            var model = new ModelView({
                imageUrl: ModelData[index][brand][i].imageUrl,
                model: ModelData[index][brand][i].name,
                specs: ModelData[index][brand][i].specs
            });

            container.add(model);

            model.modelImgSurface.pipe(this.scrollView);
            model.bgSurface.pipe(this.scrollView);
            model.modelTitleSurface.pipe(this.scrollView);

            models.push(container);

        }

        this.scrollView.on('pageChange', function() {

            var currentPage = this.scrollView._node.index;

            console.log(currentPage);

            this._eventOutput.emit('modelChange', currentPage);

        }.bind(this));

    }

    module.exports = BrandView;

});
