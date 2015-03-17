/*globals require*/

require.config({
    paths: {
        famous: 'bower_components/famous/src',
        views: 'src/views',
        data: 'src/data'
    }
});

require(['src/main']);
