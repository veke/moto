var gulp = require('gulp');
var open = require('gulp-open');
var path = require('path');
var notify = require('gulp-notify');
var EXPRESS_ROOT = __dirname;
var lr;
 
function notifyLivereload(event) {
  var fileName = path.relative(EXPRESS_ROOT, event.path);
  lr.changed({
    body: { files: [fileName] }
  });
}

gulp.task('default', function () {
  starServer();
  startLivereload();
  gulp.watch(['index.html', 'src/**/*.*'], notifyLivereload);
  gulp.src('index.html').pipe(open('', { url: 'http://localhost:8000' }));
});

function starServer() { 
  var express = require('express');
  var app = express();
  app.use(require('connect-livereload')());
  app.use(express.static(EXPRESS_ROOT));
  app.listen(8000);
}

function startLivereload() {
  lr = require('tiny-lr')();
  lr.listen(35729);
}