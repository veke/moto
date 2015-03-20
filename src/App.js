/* eslint-env browser, amd */

/* App.js */

define(function(require, exports, module) {

    'use strict';

    var Engine = require('famous/core/Engine');
    var AppView = require('views/AppView');
    var Utility = require('famous/utilities/Utility');

    var mainContext = Engine.createContext();

    Utility.loadURL('src/data/modelData.json', function(response) {

        if (!response) {
            return;
        }

        var data = JSON.parse(response);

        var appView = new AppView({
            data: data
        });

        mainContext.add(appView);

    });

});
