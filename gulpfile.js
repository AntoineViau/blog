var gulp = require('gulp');
var bs = require('browser-sync');
var sg = require('./static-generator');
var del = require('del');
var sequence = require('gulp-sequence');

gulp.task('serve', function() {
    bs.init({
        notify: false,
        server: {
            baseDir: "./build"
        }
    });
});

gulp.task('reload', bs.reload);

gulp.task('clean', function(cb) {
    return del(['./build/**/*'], cb);
});

gulp.task('build', function(cb) {
    sg('./posts', './layouts', './build');
    return cb();
});

gulp.task('build-dev', function(cb) {
    return sequence('clean', 'build', 'reload')(cb);
});

gulp.task('dev', function(cb) {
    gulp.start('serve');
    gulp.watch(['./posts/**/*', './layouts/**/*'], {}, function() {
        gulp.start('build-dev');
    });
});

gulp.task('default', function(cb) {
    gulp.start('build-dev');
});