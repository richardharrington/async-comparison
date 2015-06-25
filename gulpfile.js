var gulp        = require('gulp');
var browserSync = require('browser-sync').create();

gulp.task('serve', function() {
  browserSync.init({
    files: ['src/index.html', 'src/*.js'],
    server: 'src',
    browser: ['google chrome']
  })
});

gulp.task('default', ['serve']);

