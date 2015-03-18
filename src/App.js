/* eslint-env browser, amd */

/* App.js */

define(function(require, exports, module) {

    'use strict';

    var Engine = require('famous/core/Engine');
    var AppView = require('views/AppView');
    var Utility = require('famous/utilities/Utility');
    //var Timer = require('famous/utilities/Timer');

    var mainContext = Engine.createContext();

    //mainContext.setPerspective(900);

    Utility.loadURL('src/data/modelData.json', function(response) {

        if (!response) {
            return;
        }

        // Consume response
        var data = JSON.parse(response);

        var appView = new AppView({
            data: data
        });

        mainContext.add(appView);

    });

});
