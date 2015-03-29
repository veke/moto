/* eslint-env node */

'use strict';

var gulp = require('gulp');
var gls = require('gulp-live-server');
var shell = require('gulp-shell');
var open = require('gulp-open');
var del = require('del');
var runSequence = require('run-sequence');
var uglify = require('gulp-uglify');

gulp.task('default', function() {

    var server = gls.static('/');

    server.start();

    gulp.watch(['index.html', 'js/**/*.*', 'styles/**/*.css'], server.notify);

    gulp.src('index.html').pipe(open('', {
        url: 'http://localhost:3000'
    }));

});

gulp.task('cleanup', function(cb) {

    del([
        'dist/bower_components/famous',
        'dist/bower_components/lodash',
        'dist/build.txt'
        ], cb);

});

gulp.task('create-build', shell.task(['r.js -o build.js']));


gulp.task('build', function(cb) {

    runSequence('create-build', 'compress', 'cleanup', cb);

});

gulp.task('compress', function() {

    return gulp.src(['dist/js/main.js', 'dist/js/App.js']).pipe(uglify()).pipe(gulp.dest('dist/js'));

});
