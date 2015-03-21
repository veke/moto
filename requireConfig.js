/* eslint-env browser, amd */

require.config({
    baseUrl: '',
    paths: {
        lodash: 'bower_components/lodash/lodash.min',
        famous: 'bower_components/famous/src',
        views: 'src/views'
    }
});

require(['src/App']);
