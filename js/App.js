/* eslint-env browser, amd */

/* App.js */

define(function(require, exports, module) {

    'use strict';

    var Engine = require('famous/core/Engine');
    var Utility = require('famous/utilities/Utility');
    var StateModifier = require('famous/modifiers/StateModifier');
    var AppView = require('views/AppView');

    var mainContext = Engine.createContext();

    Utility.loadURL('data/modelData.json', function(response) {

        if (!response) {
            return;
        }

        var data = JSON.parse(response);

        var appView = new AppView({
            data: data
        });

        var appModifier = new StateModifier({
            opacity: 0
        });

        appModifier.setOpacity(1, {
            duration: 800
        });

        mainContext.add(appModifier).add(appView);

    });

});
