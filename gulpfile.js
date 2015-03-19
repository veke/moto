/* eslint-env node */

'use strict';

var gulp = require('gulp');
var gls = require('gulp-live-server');
var open = require('gulp-open');

gulp.task('default', function() {

    var server = gls.static('/');

    server.start();

    gulp.watch(['index.html', 'src/**/*.*'], server.notify);
    gulp.src('index.html').pipe(open('', {
        url: 'http://localhost:3000'
    }));

});
