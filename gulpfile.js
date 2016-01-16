var gulp = require('gulp');
var mocha = require('gulp-mocha');
var browserify = require('gulp-browserify');

gulp.task('test', function(){
  gulp
    .src('./test/index.js')
    .pipe(mocha())
    .on('error', function(err){
      this.emit('end');
    });
});

gulp.task('watch-test', function(){
  gulp.watch('./test/*.js', ['test']);
});

gulp.task('browserify', function() {
  return gulp
    .src('./index1.js')
    .pipe(browserify())
    .pipe(gulp.dest('./bin'));
});

gulp.task('watch', function() {
  gulp.watch(['./*.js'], ['browserify']);
});