/* eslint-env browser, amd */

require.config({
    paths: {
        famous: 'bower_components/famous/src',
        views: 'src/views',
        data: 'src/data'
    }
});

require(['src/App']);
