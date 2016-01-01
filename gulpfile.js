var gulp = require('gulp');
var mocha = require('gulp-mocha');

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